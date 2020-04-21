export interface RawRoomDocument {
  readonly description: string;
  readonly personCount: string;
  readonly beds: string | null;
  readonly bonuses: string[] | null;
}