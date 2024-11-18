export interface RequestAuthSent {
  url: string;
}

export interface RequestAccessTokenParams {
  code: string;
}

export interface RequestAccessTokenSent {
  accessToken: string;
  tokenType: string;
}

export interface NotionTitleBlock {
  text: string;
  pageId: string;
}

export interface NotionNameUser {
  name: string;
}

export interface NotionEmailUser {
  email: string;
}

export interface NotionBlockId {
  blockId: string;
}

export interface NotionPageId {
  pageId: string;
}

export interface NotionDatabaseId {
  databaseId: string;
}

export interface NotionLastEditedPage {
  date: string;
  editorsName: string;
}

export interface NotionLastEditedDatabase {
  date: string;
  editorsName: string;
}

export interface NotionLastEditedBlock {
  date: string;
  editorsName: string;
}

export interface NotionChildrenBlock {
  childrenNbr: string;
  editorsName: string;
}

export interface NotionCommentsInfo {
  nbrOfComments: string;
  blockId: string;
}

export interface NotionNewComment {
  pageId: string;
  text: string;
}

export interface NotionUpdateBlock {
  blockId: string;
  text: string;
}

export interface NotionCreatePage {
  pageId: string;
  title: string;
}

export interface NotionUpdateDatabase {
  databaseId: string;
  title: string;
}