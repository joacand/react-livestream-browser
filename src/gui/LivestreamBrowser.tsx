import * as React from 'react';
import { StreamListView } from "./components/StreamListView"

export class LivestreamBrowser extends React.Component {
    render(): React.ReactNode {
        return (
            <div>
                <StreamListView />
            </div>
        );
    }
}
