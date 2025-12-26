import tw from 'twin.macro';
import React, { useState, useEffect } from 'react';
import { ServerContext } from '@/state/server';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MctoolsCard from './MctoolsCard';
import CategoryTabs from './CategoryTabs';
import SearchBar from './SearchBar';
import FlashMessageRender from '@/components/FlashMessageRender';
import { useStoreActions } from '@/state/hooks';
import axios from 'axios';

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { addFlash, clearFlashes } = useStoreActions((actions) => actions.flashes);

    const [category, setCategory] = useState('Mods');
    const [provider, setProvider] = useState('modrinth');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('downloads');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ['Mods', 'Plugins', 'Resource Packs', 'Data Packs', 'Shaders', 'Modpacks'];

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/client/servers/${uuid}/mctools`, {
            params: { category, search, page, provider, sort }
        })
            .then(({ data }) => {
                setItems(data.data);
                setTotalPages(data.pagination.total_pages);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                addFlash({ type: 'error', key: 'mctools:fetch', message: error.response?.data?.error || 'Failed to fetch items from the API.' });
                setLoading(false);
            });
    }, [uuid, category, search, page, provider, sort]);

    const onInstall = (id: string, versionId: string, itemProvider: string) => {
        clearFlashes('mctools:install');
        axios.post(`/api/client/servers/${uuid}/mctools/install`, { id, version_id: versionId, provider: itemProvider, category })
            .then(({ data }) => {
                addFlash({ type: 'success', key: 'mctools:install', message: data.message });
            })
            .catch(error => {
                addFlash({ type: 'error', key: 'mctools:install', message: error.response?.data?.error || 'Failed to install item.' });
            });
    };

    return (
        <ServerContentBlock title={'Mctools Manager'}>
            <FlashMessageRender byKey={'mctools:fetch'} css={tw`mb-4`} />
            <FlashMessageRender byKey={'mctools:install'} css={tw`mb-4`} />

            <div css={tw`flex flex-col space-y-4`}>
                <CategoryTabs categories={categories} active={category} onChange={(c) => { setCategory(c); setPage(1); }} />

                <SearchBar
                    value={search}
                    onChange={(s) => { setSearch(s); setPage(1); }}
                    placeholder={`Search ${category.toLowerCase()} on ${provider === 'modrinth' ? 'Modrinth' : 'CurseForge'}...`}
                    provider={provider}
                    setProvider={(p) => { setProvider(p); setPage(1); }}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    sort={sort}
                    onSortChange={(s) => { setSort(s); setPage(1); }}
                />

                <div css={tw`flex flex-col space-y-2 mt-4`}>
                    {loading ? (
                        <div css={tw`flex justify-center py-12`}>
                            <p css={tw`text-neutral-400 animate-pulse`}>Loading items from {provider === 'modrinth' ? 'Modrinth' : 'CurseForge'}...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div css={tw`text-center py-12 text-neutral-500`}>No items found matching your criteria.</div>
                    ) : (
                        items.map(item => (
                            <MctoolsCard
                                key={item.id}
                                item={item}
                                uuid={uuid}
                                onInstall={(versionId) => onInstall(item.id, versionId, item.provider)}
                            />
                        ))
                    )}
                </div>
            </div>
        </ServerContentBlock>
    );
};
