export interface RawRoomDto {
  readonly description: string;
  readonly personCount: string;
  readonly beds: string | null;
  readonly bonuses: string[] | null;
}