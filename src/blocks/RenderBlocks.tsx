import React from 'react';

const blockComponents: Record<string, React.FC<any>> = {
  // Map block slugs to their React components here
  // Example: content: ContentComponent,
};

type Props = {
  blocks: Array<{
    blockType: string;
    [key: string]: unknown;
  }>;
};

export const RenderBlocks: React.FC<Props> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType } = block;
        const Block = blockComponents[blockType];

        if (!Block) {
          return null;
        }

        return <Block key={index} {...block} />;
      })}
    </>
  );
};
