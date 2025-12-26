import tw from 'twin.macro';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Props {
    item: any;
    onClose: () => void;
    onInstall: (version: string) => void;
}

const VersionModal = ({ item, onClose, onInstall }: Props) => {
    const [selectedVersion, setSelectedVersion] = useState('');

    const handleInstall = () => {
        if (selectedVersion) {
            onInstall(selectedVersion);
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                css={tw`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4`}
            >
                {/* Modal */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    css={tw`bg-neutral-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl`}
                >
                    {/* Header */}
                    <div css={tw`flex items-center justify-between p-4 border-b border-neutral-700`}>
                        <div css={tw`flex items-center space-x-3`}>
                            {item.icon && (
                                <img src={item.icon} alt={item.name} css={tw`w-10 h-10 rounded`} />
                            )}
                            <div>
                                <h2 css={tw`text-lg font-bold text-neutral-100`}>Install {item.name}</h2>
                                <p css={tw`text-sm text-neutral-400`}>Select a version to install</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            css={tw`text-neutral-400 hover:text-neutral-200 transition-colors`}
                        >
                            <FontAwesomeIcon icon={faTimes} css={tw`text-xl`} />
                        </button>
                    </div>

                    {/* Version List */}
                    <div css={tw`p-4 overflow-y-auto max-h-96`}>
                        {item.loadingVersions ? (
                            <div css={tw`text-center py-8 text-neutral-400`}>
                                <p className="animate-pulse">Loading versions...</p>
                            </div>
                        ) : item.versions && item.versions.length > 0 ? (
                            <div css={tw`space-y-2`}>
                                {item.versions.map((version: any) => (
                                    <div
                                        key={version.id}
                                        onClick={() => setSelectedVersion(version.id)}
                                        css={[
                                            tw`p-3 rounded border-2 cursor-pointer transition-all duration-150`,
                                            selectedVersion === version.id
                                                ? tw`border-cyan-500 bg-cyan-600 bg-opacity-20`
                                                : tw`border-neutral-700 bg-neutral-700 hover:border-neutral-600`
                                        ]}
                                    >
                                        <div css={tw`flex items-center justify-between`}>
                                            <div>
                                                <p css={tw`font-bold text-neutral-100`}>{version.name}</p>
                                                <p css={tw`text-xs text-neutral-400 mt-1`}>
                                                    {version.game_versions?.join(', ') || 'Unknown versions'}
                                                </p>
                                            </div>
                                            <div css={tw`text-right`}>
                                                <p css={tw`text-xs text-neutral-400`}>
                                                    {new Date(version.date_published).toLocaleDateString()}
                                                </p>
                                                <p css={tw`text-xs text-neutral-500 mt-1`}>
                                                    {(version.downloads || 0).toLocaleString()} downloads
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div css={tw`text-center py-8 text-neutral-400`}>
                                <p>No versions available</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div css={tw`flex items-center justify-end space-x-2 p-4 border-t border-neutral-700`}>
                        <button
                            onClick={onClose}
                            css={tw`px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded text-sm font-medium transition-colors duration-150`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInstall}
                            disabled={!selectedVersion}
                            css={tw`px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            <span>Install Selected Version</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VersionModal;
