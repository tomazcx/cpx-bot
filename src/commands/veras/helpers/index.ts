export class VerasLocators {
  static get hairCut(): string {
    return `::-p-xpath(//div[@class='flex flex-1 flex-row items-center my-4 py-4 break-words'][contains(.,'Corte de Cabelo R$  40,0045 min')])`;
  }

  static barber(barber: string): string {
    return `::-p-xpath(//button[@class='flex-shrink-0 flex-col  items-center justify-center gap-2 w-24'][contains(., ${barber})])`;
  }

  static get confirmationToast(): string {
    return `::-p-xpath(//div[@data-in='true'][contains(.,'Olá, seja bem-vindo(a) :)')])`;
  }

  static get loginForm(): string {
    return `::-p-xpath(//form[@class='flex flex-col items-center justify-center'])`;
  }
}

