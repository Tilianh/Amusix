import { SongStatus } from '../../../shared/enums/song-status';

export class SongInfo {
  public ytbId = '';
  public playlistId? = '';
  public publishedAt = '';
  public duration = 0;
  public name = '';
  public artistName = '';
  public thumbnailUrl = '';
  public status = SongStatus.VALID;
}
