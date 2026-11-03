import type {CSSProperties, ReactNode} from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useRosterLookup} from '@site/src/components/useRoster';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  const {metadata} = useDoc();
  const entry = useRosterLookup().get(metadata.id);
  return (
    <div
      className="toum-doc toum-role-scope"
      style={entry ? ({'--role': entry.color} as CSSProperties) : undefined}>
      <Layout {...props} />
    </div>
  );
}
