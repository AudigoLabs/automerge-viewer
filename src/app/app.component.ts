import { Component } from '@angular/core';
import * as Automerge from 'automerge';

export enum Type {
  NONE = 'NONE',
  DOCUMENT = 'DOCUMENT',
  SYNC_MESSAGE = 'SYNC_MESSAGE',
  SYNC_STATE = 'SYNC_STATE',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'automerge-viewer';
  public status = '';
  public type: Type = Type.NONE;
  public data: {[type: string]: any} = {};
  public docContent = {};
  public syncMessage = {};
  public syncState = {};

  public inputOnEnter(event: any) {
    if (event.code != 'Enter') {
      return;
    }
    this.status = 'Processing...';
    this.type = Type.NONE;
    const value = Buffer.from(event.target.value, 'base64') as Uint8Array;

    const doc = this.decodeDocument(value);
    if (doc) {
      this.handleResult(Type.DOCUMENT, {
        content: doc,
        history: Automerge.getAllChanges(doc).map(c => Automerge.decodeChange(c)),
        conflicts: Object.keys(doc).reduce((acc, key) => ({...acc, [key]: Automerge.getConflicts(doc, key)}), {}),
      });
      return;
    }

    const syncMessage = this.decodeSyncMessage(value);
    if (syncMessage) {
      this.handleResult(Type.SYNC_MESSAGE, syncMessage);
      return;
    }

    const syncState = this.decodeSyncState(value);
    if (syncState) {
      this.handleResult(Type.SYNC_STATE, syncState);
      return;
    }

    this.status = 'Failed to decode';
  }

  private decodeDocument(value: Uint8Array): Automerge.Doc<any> | undefined {
    try {
      return Automerge.load(value as Automerge.BinaryDocument);
    } catch {
      return;
    }
  }

  private decodeSyncMessage(value: Uint8Array): Automerge.SyncMessage | undefined {
    try {
      return Automerge.Backend.decodeSyncMessage(value as Automerge.BinarySyncMessage);
    } catch {
      return;
    }
  }

  private decodeSyncState(value: Uint8Array): Automerge.SyncState | undefined {
    try {
      return Automerge.Backend.decodeSyncState(value as Automerge.BinarySyncState);
    } catch {
      return;
    }
  }

  private handleResult(type: Type, data: any) {
    this.data[type] = data;
    this.type = type;
    this.status = `Done (${type})`;
  }
}
