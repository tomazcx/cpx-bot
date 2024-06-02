import { Injectable } from '@nestjs/common';
import { PuppeteerClient } from 'src/infra/puppeter';
import { Env } from 'src/shared/env';
import { VerasLocators } from './helpers';
import { sleep } from 'src/shared/utils';

@Injectable()
export class GetVerasAppointment {
  private barbers = ['Abner', 'Alessandro', 'daniel', 'Eduardo', 'pablo'];

  async execute(barberName: string, date?: Date): Promise<string[]> {
    const puppeteer = new PuppeteerClient(Env.VERAS_URL);
    await puppeteer.launch();
    await puppeteer.gotoUrl();

    let currentDate = date;

    if (!currentDate) {
      currentDate = new Date();
    }

    if (!this.barbers.includes(barberName)) {
      console.log(
        'Informe um barbeiro válido. Barbeiros disponíveis: ',
        this.barbers.join(', '),
      );
      return;
    }

    try {
      const hairCutNode = await puppeteer.page.waitForSelector(
        VerasLocators.hairCut,
        {
          timeout: 3000,
        },
      );

      hairCutNode.evaluate((el) => el.querySelector('button').click());

      let barberNode = await puppeteer.page.waitForSelector(
        VerasLocators.barber(barberName),
        {
          timeout: 5000,
        },
      );
      await barberNode.evaluate((el) => (el as HTMLButtonElement).click());

      await this.login(puppeteer);
      await sleep(3)
    } catch (err) {
      console.log('Erro ao buscar os horários do barbeiro: ', err);
      return;
    }

    return [];
  }

  private async login(puppeteer: PuppeteerClient): Promise<void> {
    const formNode = await puppeteer.page.waitForSelector(
      VerasLocators.loginForm,
      {
        timeout: 5000,
      },
    );
    await puppeteer.page.type("input[type='email']", Env.VERAS_EMAIL);
    await puppeteer.page.type("input[type='password']", Env.VERAS_PASSWORD);
    await formNode.evaluate((el) =>
      (el.querySelector("button[type='submit']") as HTMLButtonElement).click(),
    );
  }
}
