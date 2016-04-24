import { fetchAll, create, update } from './userContent';

const key = 'link';

export const fetchAllLinks = fetchAll(key);

export const createLink = create(key);

export const updateLink = update(key);
