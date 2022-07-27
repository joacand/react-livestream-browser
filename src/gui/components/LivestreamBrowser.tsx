import * as React from 'react';
import { StreamListView } from "./StreamListView"

export class LivestreamBrowser extends React.Component {
    render(): React.ReactNode {
        return (
            <div>
                <StreamListView />
            </div>
        );
    }
}
