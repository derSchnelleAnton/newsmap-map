import axios from 'axios';

export const fetchLocationsWithFilters = async (
  ignoreCategories,
  ignoreLocationTypes,
  startDateTime,
  endDateTime
) => {
  const params = {}
  if (ignoreCategories !== null && ignoreCategories !== undefined) {
    params.ignoreCategoriesString = ignoreCategories;
  }
  if (ignoreLocationTypes !== null && ignoreLocationTypes !== undefined) {
    params.ignoreLocationTypesString = ignoreLocationTypes;
  }
  if (startDateTime !== null && startDateTime !== undefined) {
    params.startDateTime = startDateTime;
  }
  if (endDateTime !== null && endDateTime !== undefined) {
    params.endDateTime = endDateTime;
  }
  const response = await axios.get(
    "http://localhost:8080/location/filter",
    { params }
  );
  return response.data;
}

export const fetchArticlePreviewsWithFilters = async (
  locationId,
  ignoreCategories,
  startDateTime,
  endDateTime
) => {
  const params = {}
  if (locationId !== null && locationId !== undefined) {
    params.locationId = locationId;
  }
  if (ignoreCategories !== null && ignoreCategories !== undefined) {
    params.ignoreCategoriesString = ignoreCategories;
  }
  if (startDateTime !== null && startDateTime !== undefined) {
    params.startDateTime = startDateTime;
  }
  if (endDateTime !== null && endDateTime !== undefined) {
    params.endDateTime = endDateTime;
  }
  const response = await axios.get(
    "http://localhost:8080/articlepreview/filter",
    { params }
  );
  return response.data;
}

export const fetchArticleById = async (articleId) => {
  const query = "http://localhost:8080/article/" + articleId
  const response = await axios.get(query);
  return response.data;
};

export const fetchArticleLocations = async (articleId) => {
  const query = "http://localhost:8080/location/" + articleId
  const response = await axios.get(query);
  return response.data;
};