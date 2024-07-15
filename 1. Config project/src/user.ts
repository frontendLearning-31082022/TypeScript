import { renderBlock } from './lib.js'

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
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i><span id="likes_count">${favoritesCaption}</span>
          </p>
      </div>
    </div>
    `
    )
}

export function renderCurrentUser(): void {
    const userRecord: LocalStorage_user | null = getUserData(localStorage.getItem('user'));
    const favoritesRecord: LocalStorage_favoritesAmount | null = getFavoritesAmount(localStorage.getItem('favoritesAmount'));
    if (!userRecord) return;

    renderUserBlock(userRecord.username, userRecord?.avatarUrl, favoritesRecord?.count);
}

function getUserData(data: unknown): LocalStorage_user | null {
    if (data == null) return null;

    const obj = JSON.parse(data as string);
    if ('username' in obj && 'avatarUrl' in obj) {
        return obj as LocalStorage_user;
    }
    return null;
}
function getFavoritesAmount(data: unknown): LocalStorage_favoritesAmount | null {
    if (data == null) return null;

    const obj = JSON.parse(data as string);
    if ('count' in obj) {
        return obj as LocalStorage_favoritesAmount;
    }
    return null;
}

const localstore_favorite_key = 'favoriteItems';

export function addToFavorite(like_element: HTMLElement, element: LocalStorage_liked_booking) {
    const current: LocalStorage_liked_booking = ({ id: element.id, name: element.name, image: element.image });

    const favoriteUserList = getFavoritesList();

    const stateLike = !favoriteUserList.has(current.id);
    if (stateLike) {
        like_element.classList.add('active');
        favoriteUserList.set(current.id, current);
    } else {
        like_element.classList.remove('active');
        favoriteUserList.delete(current.id);
    }

    const countObj: LocalStorage_favoritesAmount = { count: [...favoriteUserList.values()].length };
    localStorage.setItem('favoritesAmount', JSON.stringify(countObj));
    updateFavoritesAmount(countObj.count);

    const json = JSON.stringify([...favoriteUserList.values()].map(x => JSON.stringify(x)));
    localStorage.setItem(localstore_favorite_key, json);
}

export function getFavoritesList(): Map<number, LocalStorage_liked_booking> {
    let elems: LocalStorage_liked_booking[] | 'null' = JSON.parse(localStorage.getItem(localstore_favorite_key));
    if (elems === 'null' || elems === null) elems = [];
    elems = elems.map(x => JSON.parse(x));


    const mapFavorites: Map<number, LocalStorage_liked_booking> = new Map();
    elems.forEach(x => mapFavorites.set(x.id, x));
    return mapFavorites;
}

function updateFavoritesAmount(count: number) {
    if (count != undefined) {
        document.getElementById('likes_count')?.textContent = count.toString();
    }
}
