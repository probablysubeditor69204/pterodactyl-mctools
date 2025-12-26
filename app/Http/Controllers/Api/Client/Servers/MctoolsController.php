<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers;

use GuzzleHttp\Client;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\Permission;
use Pterodactyl\Models\MctoolsConfig;
use Pterodactyl\Services\Nodes\NodeJWTService;
use Illuminate\Auth\Access\AuthorizationException;
use Pterodactyl\Repositories\Wings\DaemonFileRepository;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;

class MctoolsController extends ClientApiController
{
    protected array $httpClient;
    private DaemonFileRepository $daemonFileRepository;

    /**
     * MctoolsController constructor.
     */
    public function __construct(
        private NodeJWTService $jwtService,
        DaemonFileRepository $daemonFileRepository
    ) {
        $config = MctoolsConfig::first();
        $apiKey = $config?->curseforge_api_key ?? '';

        $this->httpClient = [
            'modrinth' => new Client([
                'base_uri' => 'https://api.modrinth.com/v2/',
                'timeout' => 30,
                'connect_timeout' => 10,
            ]),
            'curseforge' => new Client([
                'base_uri' => 'https://api.curseforge.com/v1/',
                'headers' => [
                    'Accept' => 'application/json',
                    'X-API-Key' => $apiKey
                ],
                'timeout' => 30,
                'connect_timeout' => 10,
            ]),
        ];
        $this->daemonFileRepository = $daemonFileRepository;
    }

    /**
     * Fetches a list of content from providers.
     */
    public function index(Request $request, Server $server)
    {
        if (!$request->user()->can(Permission::ACTION_FILE_READ, $server)) {
            throw new AuthorizationException();
        }

        $category = $request->query('category', 'Mods');
        $search = $request->query('search', '');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 20);
        $offset = ($page - 1) * $limit;
        $provider = $request->query('provider', 'modrinth');
        $sort = $request->query('sort', 'downloads');

        if ($provider === 'curseforge') {
            return $this->fetchCurseForgeItems($category, $search, $page, $limit, $offset, $sort);
        }

        return $this->fetchModrinthItems($category, $search, $page, $limit, $offset, $sort);
    }

    private function fetchModrinthItems($category, $search, $page, $limit, $offset, $sort)
    {
        $contentTypes = [
            'Mods' => 'mod',
            'Plugins' => 'mod',
            'Resource Packs' => 'resourcepack',
            'Data Packs' => 'datapack',
            'Shaders' => 'shader',
            'Modpacks' => 'modpack'
        ];

        $type = $contentTypes[$category] ?? 'mod';

        try {
            $client = $this->httpClient['modrinth'];
            $facets = [
                ["project_type:$type"],
                ["server_side!=unsupported"]
            ];

            if ($category === 'Plugins') {
                $facets[] = ["categories:bukkit", "categories:spigot", "categories:paper", "categories:purpur", "categories:velocity", "categories:bungeecord", "categories:waterfall"];
            }
            
            $response = $client->get('search', [
                'query' => [
                    'query' => $search,
                    'limit' => $limit,
                    'offset' => $offset,
                    'facets' => json_encode($facets),
                    'index' => $sort === 'relevance' ? 'relevance' : ($sort === 'updated' ? 'updated' : 'downloads')
                ],
                'timeout' => 10
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            $formatted = array_map(function ($item) {
                return [
                    'id' => $item['project_id'],
                    'name' => $item['title'],
                    'author' => $item['author'],
                    'description' => $item['description'],
                    'icon' => $item['icon_url'],
                    'downloads' => $this->formatDownloads($item['downloads']),
                    'followers' => $this->formatFollowers($item['follows']),
                    'tags' => array_slice($item['categories'] ?? [], 0, 5),
                    'provider' => 'modrinth',
                    'installable' => true,
                ];
            }, $data['hits']);

            return response()->json([
                'data' => $formatted,
                'pagination' => [
                    'total' => $data['total_hits'],
                    'current_page' => $page,
                    'total_pages' => (int) ceil($data['total_hits'] / $limit),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch Modrinth data: ' . $e->getMessage()], 500);
        }
    }

    private function fetchCurseForgeItems($category, $search, $page, $limit, $offset, $sort)
    {
        $classIds = [
            'Mods' => 6,
            'Plugins' => 5,
            'Resource Packs' => 12,
            'Data Packs' => 17,
            'Shaders' => 6552,
            'Modpacks' => 4471
        ];

        $classId = $classIds[$category] ?? 6;

        try {
            $client = $this->httpClient['curseforge'];
            $response = $client->get('mods/search', [
                'query' => [
                    'gameId' => 432, // Minecraft
                    'classId' => $classId,
                    'searchFilter' => $search,
                    'pageSize' => $limit,
                    'index' => $offset,
                    'sortField' => $sort === 'relevance' ? 2 : ($sort === 'updated' ? 3 : 6),
                    'sortOrder' => 'desc'
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            $formatted = array_map(function ($item) {
                return [
                    'id' => $item['id'],
                    'name' => $item['name'],
                    'author' => $item['authors'][0]['name'] ?? 'Unknown',
                    'description' => $item['summary'],
                    'icon' => $item['logo']['thumbnailUrl'] ?? '',
                    'downloads' => $this->formatDownloads($item['downloadCount']),
                    'followers' => 'N/A',
                    'tags' => array_map(fn($t) => $t['name'], array_slice($item['categories'], 0, 5)),
                    'provider' => 'curseforge',
                    'installable' => true,
                ];
            }, $data['data']);

            return response()->json([
                'data' => $formatted,
                'pagination' => [
                    'total' => $data['pagination']['totalCount'],
                    'current_page' => $page,
                    'total_pages' => (int) ceil($data['pagination']['totalCount'] / $limit),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch CurseForge data. Make sure API key is set in Admin area.'], 500);
        }
    }

    /**
     * Fetches available versions for a specific item.
     */
    public function versions(Request $request, Server $server)
    {
        if (!$request->user()->can(Permission::ACTION_FILE_READ, $server)) {
            throw new AuthorizationException();
        }

        $id = $request->query('id');
        $provider = $request->query('provider', 'modrinth');

        try {
            if ($provider === 'modrinth') {
                $client = $this->httpClient['modrinth'];
                $response = $client->get("project/{$id}/version");
                $versions = json_decode($response->getBody()->getContents(), true);

                $formatted = array_map(function ($version) {
                    return [
                        'id' => $version['id'],
                        'name' => $version['name'],
                        'version_number' => $version['version_number'],
                        'game_versions' => $version['game_versions'] ?? [],
                        'date_published' => $version['date_published'],
                        'downloads' => $version['downloads'] ?? 0,
                        'files' => $version['files'] ?? []
                    ];
                }, $versions);

                return response()->json(['versions' => $formatted]);
            } else if ($provider === 'curseforge') {
                $client = $this->httpClient['curseforge'];
                $response = $client->get("mods/{$id}/files");
                $files = json_decode($response->getBody()->getContents(), true);

                $formatted = array_map(function ($file) {
                    return [
                        'id' => $file['id'],
                        'name' => $file['displayName'],
                        'version_number' => $file['fileName'],
                        'game_versions' => $file['gameVersions'] ?? [],
                        'date_published' => $file['fileDate'],
                        'downloads' => $file['downloadCount'] ?? 0,
                        'files' => [['url' => $file['downloadUrl'], 'filename' => $file['fileName']]]
                    ];
                }, $files['data'] ?? []);

                return response()->json(['versions' => $formatted]);
            }

            return response()->json(['error' => 'Unsupported provider.'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch versions: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Installs a specific item.
     */
    public function install(Request $request, Server $server)
    {
        if (!$request->user()->can(Permission::ACTION_FILE_CREATE, $server)) {
            throw new AuthorizationException();
        }

        $id = $request->input('id');
        $versionId = $request->input('version_id');
        $provider = $request->input('provider', 'modrinth');
        $category = $request->input('category', 'Mods');

        $directory = match($category) {
            'Mods' => '/mods',
            'Resource Packs' => '/resourcepacks',
            'Data Packs' => '/world/datapacks',
            'Shaders' => '/shaderpacks',
            'Modpacks' => '/',
            default => '/plugins'
        };

        try {
            if ($provider === 'modrinth') {
                $client = $this->httpClient['modrinth'];
                
                if ($versionId) {
                    // Fetch specific version
                    $response = $client->get("version/{$versionId}");
                    $version = json_decode($response->getBody()->getContents(), true);
                    $file = $version['files'][0];
                } else {
                    // Fallback to latest version
                    $response = $client->get("project/{$id}/version");
                    $versions = json_decode($response->getBody()->getContents(), true);
                    
                    if (empty($versions)) {
                        return response()->json(['error' => 'No versions found for this item.'], 404);
                    }
                    $file = $versions[0]['files'][0];
                }
                
                $downloadUrl = $file['url'];
                $fileName = $file['filename'];
            } else if ($provider === 'curseforge') {
                $client = $this->httpClient['curseforge'];
                
                if ($versionId) {
                    // Fetch specific file
                    $response = $client->get("mods/{$id}/files/{$versionId}");
                    $fileData = json_decode($response->getBody()->getContents(), true);
                    $file = $fileData['data'];
                } else {
                    // Fallback to latest file
                    $response = $client->get("mods/{$id}/files");
                    $files = json_decode($response->getBody()->getContents(), true);

                    if (empty($files['data'])) {
                        return response()->json(['error' => 'No files found for this item.'], 404);
                    }
                    $file = $files['data'][0];
                }

                $downloadUrl = $file['downloadUrl'];
                $fileName = $file['fileName'];
            } else {
                return response()->json(['error' => 'Unsupported provider.'], 400);
            }

            $this->daemonFileRepository->setServer($server)->pull(
                $downloadUrl,
                $directory,
                ['foreground' => true]
            );

            return response()->json(['success' => true, 'message' => "Successfully started installation of {$fileName} on your server."]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Installation failed: ' . $e->getMessage()], 500);
        }
    }

    private function formatDownloads($count) {
        if ($count >= 1000000) return round($count / 1000000, 2) . 'M';
        if ($count >= 1000) return round($count / 1000, 1) . 'K';
        return $count;
    }

    private function formatFollowers($count) {
        if ($count >= 1000) return round($count / 1000, 1) . 'k';
        return $count;
    }
}
