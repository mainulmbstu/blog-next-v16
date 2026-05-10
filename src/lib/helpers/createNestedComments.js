"use server";

export const createNestedComments = async (items, parentId = null) => {
  let itemList = [];
  let filteredItem;
  if (parentId == null) {
    filteredItem = await items.filter((item) => item.parentId == undefined);
  } else {
    filteredItem = await items.filter((item) => item.parentId == parentId);
  }
  for (let v of filteredItem) {
    itemList.push({
      ...v?._doc,
      children: await createNestedComments(items, v._id),
    });
    // itemList.push({
    //   _id: v._id,
    //   name: v.name,
    //   slug: v.slug,
    //   parentId: v.parentId,
    //   picture: v.picture,
    //   user: v.user,
    //   createdAt: v.createdAt,
    //   updatedAt: v.updatedAt,
    //   children: await createNestedComments(items, v._id),
    // });
  }
  // console.log(commentsList);
  return itemList;
};
