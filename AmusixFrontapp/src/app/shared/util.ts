export class Util {
  /**
   * Convert a duration from a number of seconds to a text formatted as 'hh:mm:ss'.
   * @returns Formatted duration.
   */
  public static formateDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return (hours > 0 ? `${hours < 10 ? 0 : ''}${hours}:` : '') +
      `${minutes < 10 ? 0 : ''}${minutes}:` +
      `${seconds < 10 ? 0 : ''}${seconds}`;
  }
}
