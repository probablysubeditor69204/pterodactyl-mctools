import tw from 'twin.macro';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faCloudDownloadAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import VersionModal from './VersionModal';
import axios from 'axios';

interface Props {
    item: any;
    uuid: string;
    onInstall: (versionId: string) => void;
}

const MctoolsCard = ({ item, uuid, onInstall }: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [versions, setVersions] = useState<any[]>([]);
    const [loadingVersions, setLoadingVersions] = useState(false);

    const handleInstallClick = () => {
        setShowModal(true);
        setLoadingVersions(true);

        // Fetch versions from API
        axios.get(`/api/client/servers/${uuid}/mctools/versions`, {
            params: {
                id: item.id,
                provider: item.provider
            }
        })
            .then(({ data }) => {
                setVersions(data.versions || []);
                setLoadingVersions(false);
            })
            .catch(error => {
                console.error('Failed to fetch versions:', error);
                setVersions([]);
                setLoadingVersions(false);
            });
    };

    const itemWithVersions = {
        ...item,
        versions: versions,
        loadingVersions: loadingVersions
    };

    return (
        <>
            <div css={tw`flex rounded no-underline text-neutral-200 items-center bg-neutral-700 p-4 border border-transparent transition-colors duration-150 overflow-hidden hover:border-neutral-500 mb-2`}>
                {/* Project Icon */}
                <div css={tw`rounded-full w-16 h-16 flex items-center justify-center bg-neutral-500 p-1 overflow-hidden flex-shrink-0`}>
                    {item.icon ? (
                        <img src={item.icon} alt={item.name} css={tw`w-full h-full object-cover rounded-full`} />
                    ) : (
                        <div css={tw`text-neutral-400 text-xs`}>No Icon</div>
                    )}
                </div>

                {/* Content Area */}
                <div css={tw`flex-1 ml-4 min-w-0`}>
                    <p css={tw`text-lg font-medium truncate`}>{item.name}</p>
                    <p css={tw`text-sm text-neutral-400 truncate mt-1`}>{item.description}</p>
                    <div css={tw`flex items-center space-x-4 mt-2 text-neutral-400 text-xs`}>
                        <div css={tw`flex items-center space-x-1`}>
                            <FontAwesomeIcon icon={faCloudDownloadAlt} />
                            <span>{item.downloads}</span>
                        </div>
                        {item.followers !== 'N/A' && (
                            <div css={tw`flex items-center space-x-1`}>
                                <FontAwesomeIcon icon={faHeart} />
                                <span>{item.followers}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tags */}
                <div css={tw`ml-4 hidden md:flex flex-wrap gap-1 max-w-xs`}>
                    {item.tags.slice(0, 3).map((tag: string) => (
                        <span
                            key={tag}
                            css={tw`px-2 py-1 bg-neutral-600 rounded text-xs text-neutral-300`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Action Button */}
                <div css={tw`ml-4`}>
                    <button
                        onClick={handleInstallClick}
                        css={tw`bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-150`}
                    >
                        <FontAwesomeIcon icon={faDownload} css={tw`mr-2`} />
                        Install
                    </button>
                </div>
            </div>

            {/* Version Modal */}
            {showModal && (
                <VersionModal
                    item={itemWithVersions}
                    onClose={() => setShowModal(false)}
                    onInstall={onInstall}
                />
            )}
        </>
    );
};

export default MctoolsCard;
