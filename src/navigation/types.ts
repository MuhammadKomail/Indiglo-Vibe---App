// src/navigation/types.ts
import {Article} from '../types/news.type';

export type RootStackParamList = {
  NewsDetail: {article: Article};
  // Add other screens and their params here
};
