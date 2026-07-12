import { SongStatus } from '../../../shared/enums/song-status';

export class PlaylistSong {
  public ytbId = '';
  public playlistId = '';
  public addedAt = '';
  public publishedAt = '';
  public duration = 0;
  public name = '';
  public artistName = '';
  public thumbnailUrl = '';
  public status = SongStatus.VALID;
}
