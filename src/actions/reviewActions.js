import { fetchAll, create, update } from './userContent';

const key = 'review';

export const fetchAllReviews = fetchAll(key);

export const createReview = create(key);

export const updateReview = update(key);
