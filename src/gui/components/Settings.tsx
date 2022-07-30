
import * as React from 'react';
import { Config } from '../../core/Config'
import { Button, Stack, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

declare global {
    interface Window {
        api: {
            send: (channel: string, ...arg: any) => void;
            getConfig: () => Config;
        }
    }
}

const config = window.api.getConfig();

export class Settings extends React.Component {

    saveChanges(): void {
        console.log("Will save data when implemented");
    }

    render(): React.ReactNode {
        return (
            <div style={{ width: 'auto', height: '100%' }}>
                <Stack direction="column" alignItems="left" gap={1} style={{ paddingBottom: '10px' }}>
                    {Array.from(Object.keys(config)).map(x => (
                        <TextField
                            required
                            id="outlined-required"
                            label={x}
                            defaultValue={Reflect.get(config, x)}
                        />
                    ))}
                </Stack>

                <Stack direction="row" alignItems="center" gap={1}>
                    <Link to="/" onClick={this.saveChanges}>
                        <Button variant="contained">
                            <SaveIcon />
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button variant="contained">
                            <CancelIcon />
                        </Button>
                    </Link>
                </Stack>
            </div>
        )
    }
}
