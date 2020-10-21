// These don't have ids because when putting them into the db the db assigns an id that doesn't necessarily align with what we specify

export const hogwarts = {
  providerName: 'Hogwarts Childcare',
};

export const beauxbatons = {
  providerName: 'Académie de Magie Beauxbâtons',
};

export const durmstrang = {
  providerName: 'Durmstrang',
};

export const organizations = [hogwarts, beauxbatons, durmstrang];
