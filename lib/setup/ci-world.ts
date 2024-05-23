/* eslint-disable @typescript-eslint/no-useless-constructor */
import { World } from '@cucumber/cucumber';
import { messages } from '@cucumber/messages';
import { BrowserContext } from 'playwright';
import Logger from '../helpers/Logger';
import { test } from '../../page-objects/test';

export interface ICIWorld extends World {
    debug: boolean;
    feature?: messages.IPickle;
    context;
    logger: Logger;
    testApp:test;
}