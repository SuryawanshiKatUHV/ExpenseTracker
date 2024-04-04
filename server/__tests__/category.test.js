const common = require('./common');

beforeAll(async () => {
  await common.login();
});

describe('Category web service', () => {
  let categoryId;

  it ("should create new category", async () =>{
    const payload = {OWNER_ID:common.getLoginUserId(), CATEGORY_TITLE:"Test title", CATEGORY_DESCRIPTION:"Test description"};
    const res = await common.httpPost('/api/categories', payload);
    
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body)).toBe(false);
    expect(res.body).toHaveProperty('CATEGORY_ID');

    categoryId = res.body.CATEGORY_ID;
    console.log(`CATEGORY_ID:${categoryId}`);
  });

  it('should return an array of categories', async () => {
    const res = await common.httpGet('/api/categories');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length > 0).toBe(true);

    let categoryFound = false;
    res.body.forEach(category => {
      checkForCategoryProperties(category);

      // This list should have the category we just created
      if (category.CATEGORY_ID === categoryId) {
        categoryFound = true;
      }
    });

    expect(categoryFound).toBe(true);
  });

  it ("should return a category with given id", async () => {
    await getCategoryAndCheck(categoryId, {CATEGORY_TITLE:"Test title", CATEGORY_DESCRIPTION:"Test description"});
  });

  it ("should update a category with given id", async () =>{
    const res = await common.httpPut(`/api/categories/${categoryId}`, {CATEGORY_TITLE:"Test title1", CATEGORY_DESCRIPTION:"Test description1"});
    
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body)).toBe(true);

    await getCategoryAndCheck(categoryId, {CATEGORY_TITLE:"Test title1", CATEGORY_DESCRIPTION:"Test description1"});
  });

  it ("should delete a category with given id", async () => {
    const res = await common.httpDelete(`/api/categories/${categoryId}`);
    
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body)).toBe(false);
  });

}); // describe

async function  getCategoryAndCheck(id, {CATEGORY_TITLE, CATEGORY_DESCRIPTION}) {
  const res = await common.httpGet(`/api/categories/${id}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(false);

    let category = res.body;
    checkForCategoryProperties(category);

    expect(category.CATEGORY_TITLE).toBe(CATEGORY_TITLE);
    expect(category.CATEGORY_DESCRIPTION).toBe(CATEGORY_DESCRIPTION);
}

function checkForCategoryProperties(category) {
  expect(category).toHaveProperty('CATEGORY_ID');
  expect(category).toHaveProperty('CATEGORY_TITLE');
  expect(category).toHaveProperty('CATEGORY_DESCRIPTION');
  expect(category).toHaveProperty('OWNER_ID');
}

afterAll(() => {
  console.log(`afterAll() completed.`)
});