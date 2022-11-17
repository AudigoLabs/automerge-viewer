import { Component } from '@angular/core';
import * as Automerge from 'automerge';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'automerge-viewer';
  public data = {};
  public status = '';

  public inputOnEnter(event: any) {
    if (event.code != 'Enter') {
      return;
    }
    const value = Buffer.from(event.target.value, 'base64') as Uint8Array;

    const doc = this.decodeDocument(value);
    if (doc) {
      this.data = doc;
      this.status = 'Decoded document';
      return;
    }

    const syncMessage = this.decodeSyncMessage(value);
    if (syncMessage) {
      this.data = syncMessage;
      this.status = 'Decoded sync message';
      return;
    }

    const syncState = this.decodeSyncState(value);
    if (syncState) {
      this.data = syncState;
      this.status = 'Decoded sync state';
      return;
    }

    this.status = 'Failed to decode';
    this.data = {};
  }

  public decodeDocument(value: Uint8Array): Automerge.FreezeObject<any> | undefined {
    try {
      return Automerge.load(value as Automerge.BinaryDocument);
    } catch {
      return;
    }
  }

  public decodeSyncMessage(value: Uint8Array): Automerge.SyncMessage | undefined {
    try {
      return Automerge.Backend.decodeSyncMessage(value as Automerge.BinarySyncMessage);
    } catch {
      return;
    }
  }

  public decodeSyncState(value: Uint8Array): Automerge.SyncState | undefined {
    try {
      return Automerge.Backend.decodeSyncState(value as Automerge.BinarySyncState);
    } catch {
      return;
    }
  }
}
