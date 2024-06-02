import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { ElementHandle, Puppeteer } from 'puppeteer';
import { PuppeteerClient } from 'src/infra/puppeter';
import { Env } from 'src/shared/env';
import {RuLocators} from './helpers'

enum MealIndex {
  BREAKFAST = 1,
  LUNCH = 3,
  DINNER = 5,
}

interface Menu {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

@Injectable()
export class GetMenu {
  private separateStringRegex = /^(.*?)(<)/;

  async execute(date?: Date): Promise<Menu> {
    const puppeteer = new PuppeteerClient(Env.RU_URL);
    await puppeteer.launch();
    await puppeteer.gotoUrl();

    let currentDate = date;

    if (!currentDate) {
      currentDate = new Date();
    }
    const dateStr = format(currentDate, 'dd/MM/yy');
    const result: Menu = {
      breakfast: [],
      lunch: [],
      dinner: [],
    };

    try {
      const node = await puppeteer.page.waitForSelector(
        RuLocators.menuLocator(dateStr),
        {
          timeout: 3000,
        },
      );

      const siblingTag = await node.evaluate(
        (el) => el.nextElementSibling.localName,
      );

      if (siblingTag !== 'figure') {
        console.log('RU fechado para a data: ', dateStr);
        return;
      }
      result.breakfast = await this.getMeal(MealIndex.BREAKFAST, node);
      result.lunch = await this.getMeal(MealIndex.LUNCH, node);
      result.dinner = await this.getMeal(MealIndex.DINNER, node);
    } catch (err) {
      console.log(
        'Erro ao buscar o cardápio para essa data. Provavelmente, o RU não estará aberto.',
      );
      return;
    }

    return result;
  }

  private async getMeal(
    meal: MealIndex,
    node: ElementHandle<Element>,
  ): Promise<string[]> {
    const breakfastCell = await node.evaluate((el, meal) => {
      const rows = el.nextElementSibling.querySelectorAll('tr');
      const breakfastRow = rows[meal];
      return breakfastRow.firstElementChild.innerHTML;
    }, meal);

    const food = breakfastCell.split('<br>');
    return food
      .map((s) => s.match(this.separateStringRegex)[1].trim())
      .filter((s) => s);
  }
}
