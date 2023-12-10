import { Injectable } from '@nestjs/common';
import puppeteer, { PuppeteerLaunchOptions } from 'puppeteer';
import * as locateChrome from 'locate-chrome';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { InvoicePDF } from 'src/shared/interfaces/pdf.interface';
// import configuration from 'src/config/default.config';

@Injectable()
export class PdfService {
  constructor() {}

  async generatePDF(data?: InvoicePDF) {
    const options = await this.getOptions();

    // Create a browser instance
    const browser = await puppeteer.launch(options);

    // Create a new page
    const page = await browser.newPage();

    const templateFile = './templates/invoice';
    const contentFile = `${templateFile}/content.hbs`;
    const headerFile = `${templateFile}/header.html`;
    const footerFile = `${templateFile}/footer.html`;

    //Get HTML content from HTML file
    const content = fs.readFileSync(contentFile, 'utf-8');
    const header = fs.readFileSync(headerFile, 'utf-8');
    const footer = fs.readFileSync(footerFile, 'utf-8');

    const template = Handlebars.compile(content);

    await page.setContent(template(data), { waitUntil: 'networkidle0' });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    const folder = `./files/invoices`;
    const fileName = `${data.invoiceNumber}.pdf`;
    const path = `${folder}/${fileName}`;

    // Download the PDF
    await page.pdf({
      path: path,
      margin: { top: '165px', bottom: '150px' },
      displayHeaderFooter: true,
      printBackground: true,
      format: 'A4',
      headerTemplate: header,
      footerTemplate: footer,
    });

    // Close the browser instance
    await browser.close();

    return { folder, fileName, path };
  }

  async getOptions(): Promise<PuppeteerLaunchOptions> {
    const executablePath: string = (await new Promise((resolve) => locateChrome((arg: any) => resolve(arg)))) || '';

    const args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];

    const options: PuppeteerLaunchOptions = {
      headless: 'new',
      executablePath,
      args,
    };

    // if (configuration().nest.NODE_ENV === 'development') {
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   const { executablePath, ...newOptions } = options;
    //   return newOptions;
    // }

    return options;
  }
}
