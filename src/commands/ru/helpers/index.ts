export class RuLocators {
  static menuLocator(dateStr: string): string {
    return `::-p-xpath(//p[contains(., '${dateStr}')])`;
  }
}
