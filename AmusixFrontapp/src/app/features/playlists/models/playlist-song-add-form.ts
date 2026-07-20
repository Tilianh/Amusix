import { SongStatus } from '../../../shared/enums/song-status';

export class PlaylistSongAddForm {
  public songYtbId = '';
  public songPublishedAt = '';
  public songDuration = 0;
  public songName = '';
  public songArtistName = '';
  public songThumbnailUrl = '';
  public songStatus = SongStatus.VALID;
}
