import { renderBlock } from './lib.js'
import { localStorage_user as UserRecord, localStorage_favoritesAmount as FavoritesRecord } from './types.js';

export function renderUserBlock(userName: string, avatarLink: string | undefined, favoriteItemsAmount: number | undefined): void {
    const favoritesCaption = favoriteItemsAmount ? favoriteItemsAmount : 'ничего нет'
    const hasFavoriteItems = favoriteItemsAmount ? true : false

    renderBlock(
        'user-block',
        `
    <div class="header-container">
      <img class="avatar" src="${avatarLink}" alt="Wade Warren" />
      <div class="info">
          <p class="name">${userName}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
    )
}

export function renderCurrentUser(): void {
    const userRecord: UserRecord | null = getUserData(localStorage.getItem('user'));
    const favoritesRecord: FavoritesRecord | null = getFavoritesAmount(localStorage.getItem('favoritesAmount'));
    if(!userRecord)return;

    renderUserBlock(userRecord.username, userRecord?.avatarUrl, favoritesRecord?.count);
}

function getUserData(data: unknown): UserRecord | null {
    if(data==null)return null;

    const obj = JSON.parse(data as string);
    if ('username' in obj && 'avatarUrl' in obj) {
        return obj as UserRecord;
    }
    return null;
}
function getFavoritesAmount(data: unknown): FavoritesRecord | null {
    if(data==null)return null;

    const obj = JSON.parse(data as string);
    if ('count' in obj) {
        return obj as FavoritesRecord;
    }
    return null;
}
