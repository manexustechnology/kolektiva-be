
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Default"
          ]
        }
      },
      "/property": {
        "post": {
          "operationId": "PropertyController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePropertyDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully created new property!"
            }
          },
          "tags": [
            "Property"
          ]
        },
        "get": {
          "operationId": "PropertyController_findAll",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Successfully get property data!"
            }
          },
          "tags": [
            "Property"
          ]
        }
      },
      "/property/{id}": {
        "get": {
          "operationId": "PropertyController_findOne",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully get property data!"
            }
          },
          "tags": [
            "Property"
          ]
        },
        "patch": {
          "operationId": "PropertyController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePropertyDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully updated property!"
            }
          },
          "tags": [
            "Property"
          ]
        },
        "delete": {
          "operationId": "PropertyController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully deleted property!"
            }
          },
          "tags": [
            "Property"
          ]
        }
      },
      "/property/set-aftermarket/{id}": {
        "patch": {
          "operationId": "PropertyController_setAftermarket",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully set property to aftermarket phase!"
            }
          },
          "tags": [
            "Property"
          ]
        }
      },
      "/property/set-settlement/{id}": {
        "patch": {
          "operationId": "PropertyController_setSettlement",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully set property to settlement phase!"
            }
          },
          "tags": [
            "Property"
          ]
        }
      },
      "/user-property": {
        "post": {
          "operationId": "UserPropertyOwnershipController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserPropertyDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully created new user property!"
            }
          },
          "tags": [
            "User Property Ownership"
          ]
        }
      },
      "/user-property/{walletAddress}": {
        "get": {
          "operationId": "UserPropertyOwnershipController_findUserProperties",
          "parameters": [
            {
              "name": "walletAddress",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully get user property data!"
            }
          },
          "tags": [
            "User Property Ownership"
          ]
        }
      },
      "/user-property/count/{walletAddress}": {
        "get": {
          "operationId": "UserPropertyOwnershipController_getCountUserProperties",
          "parameters": [
            {
              "name": "walletAddress",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully get count user property data!"
            }
          },
          "tags": [
            "User Property Ownership"
          ]
        }
      },
      "/property-listing-request/submit": {
        "post": {
          "operationId": "PropertyListingRequestController_submitPropertyListingRequest",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubmitPropertyListingDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Form submitted successfully!"
            }
          },
          "tags": [
            "Property Listing Request (User)"
          ]
        }
      },
      "/property-listing-request/{id}": {
        "put": {
          "operationId": "PropertyListingRequestController_updatePropertyListingRequest",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubmitPropertyListingDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Form submitted successfully!"
            }
          },
          "tags": [
            "Property Listing Request (User)"
          ]
        }
      },
      "/admin/property-listing-request": {
        "get": {
          "operationId": "AdminPropertyListingRequestController_getListPropertyRequest",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "perPage",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "status",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "search",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Data retrieved successfully!"
            }
          },
          "tags": [
            "Property Listing Request (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/property-listing-request/detail/{id}": {
        "get": {
          "operationId": "AdminPropertyListingRequestController_getPropertyRequestDetail",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Data retrieved successfully!"
            }
          },
          "tags": [
            "Property Listing Request (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/property-listing-request/change-status/{id}": {
        "patch": {
          "operationId": "AdminPropertyListingRequestController_changePropertyRequestStatus",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminChangePropertyListingRequestStatusBodyDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Status successfully updated!"
            }
          },
          "tags": [
            "Property Listing Request (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/property-listing-request/remove/{id}": {
        "delete": {
          "operationId": "AdminPropertyListingRequestController_removePropertyListingRequest",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Property Listing Request (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/listed-property": {
        "get": {
          "operationId": "AdminListedPropertyController_list",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "perPage",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "status",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchAddress",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Data retrieved successfully!"
            }
          },
          "tags": [
            "Listed Property (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/listed-property/detail/{id}": {
        "get": {
          "operationId": "AdminListedPropertyController_getPropertyRequestDetail",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Data retrieved successfully!"
            }
          },
          "tags": [
            "Listed Property (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/listed-property/change-status/{id}": {
        "patch": {
          "operationId": "AdminListedPropertyController_changePropertyRequestStatus",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminChangeListedPropertyStatusDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Status successfully updated!"
            }
          },
          "tags": [
            "Listed Property (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/listed-property/change-phase/{id}": {
        "patch": {
          "operationId": "AdminListedPropertyController_changePropertyRequestPhase",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminChangeListedPropertyPhaseDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Status successfully updated!"
            }
          },
          "tags": [
            "Listed Property (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/listed-property/submit": {
        "post": {
          "operationId": "AdminListedPropertyController_submitListedProperty",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyDataDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Property successfully created!"
            }
          },
          "tags": [
            "Listed Property (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/listed-property/update/{id}": {
        "put": {
          "operationId": "AdminListedPropertyController_updateListedProperty",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyDataDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Property successfully updated!"
            }
          },
          "tags": [
            "Listed Property (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/admin/listed-property/remove/{id}": {
        "delete": {
          "operationId": "AdminListedPropertyController_removeListedProperty",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Property successfully removed!"
            }
          },
          "tags": [
            "Listed Property (Admin)"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/kolektiva-contract": {
        "post": {
          "operationId": "KolektivaContractController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/KolektivaCreatePropertyDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully created new kolektiva property!"
            }
          },
          "tags": [
            "Kolektiva Contract"
          ]
        }
      },
      "/auth/invite-code": {
        "post": {
          "operationId": "AuthController_applyInviteCode",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InviteCodeBodyDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Data is valid!"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/auth/finish-onboarding": {
        "post": {
          "operationId": "AuthController_finishOnboarding",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Successfully verify data!"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/auth/store/onboarding-step": {
        "post": {
          "operationId": "AuthController_storeOnboardingStep",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/StoreOnBoardingStepBodyDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully get on boarding step data!"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_me",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Successfully get user data!"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/auth/update/zkme-verification": {
        "post": {
          "operationId": "AuthController_setUserZkmeVerification",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Successfully verify data!"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/user-activities/create": {
        "post": {
          "operationId": "UserActivityController_createUserActivity",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserActivityDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User activity successfully created!"
            }
          },
          "tags": [
            "User Activities"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/user-activities/list": {
        "get": {
          "operationId": "UserActivityController_listUserActivities",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "perPage",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sort",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "userId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "propertyId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "activityType",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "activity",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "dateRange",
              "required": false,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "User activities successfully retrieved!"
            }
          },
          "tags": [
            "User Activities"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/user-activities/update/{id}": {
        "patch": {
          "operationId": "UserActivityController_updateUserActivity",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserActivityDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "User activity successfully updated!"
            }
          },
          "tags": [
            "User Activities"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/user-activities/remove/{id}": {
        "delete": {
          "operationId": "UserActivityController_removeUserActivity",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "User activity successfully removed!"
            }
          },
          "tags": [
            "User Activities"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/dashboard/total-users": {
        "get": {
          "operationId": "DashboardController_getTotalUsers",
          "parameters": [
            {
              "name": "dateRange",
              "required": false,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/dashboard/new-users": {
        "get": {
          "operationId": "DashboardController_getUserCounts",
          "parameters": [
            {
              "name": "dateRange",
              "required": false,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/dashboard/property-counts": {
        "get": {
          "operationId": "DashboardController_getPropertyCounts",
          "parameters": [
            {
              "name": "dateRange",
              "required": false,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/dashboard/user-activities": {
        "get": {
          "operationId": "DashboardController_getUserActivities",
          "parameters": [
            {
              "name": "dateRange",
              "required": false,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/dashboard/property-requests": {
        "get": {
          "operationId": "DashboardController_getPropertyListingRequests",
          "parameters": [
            {
              "name": "dateRange",
              "required": false,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/dashboard/latest-trades": {
        "get": {
          "operationId": "DashboardController_getLatestTrades",
          "parameters": [
            {
              "name": "dateRange",
              "required": false,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            {
              "name": "activity",
              "required": false,
              "in": "query",
              "description": "Activity type for filtering",
              "schema": {
                "enum": [
                  "buy",
                  "sell"
                ],
                "type": "string"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Limit for query results",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      }
    },
    "info": {
      "title": "Kolektiva API Documentation",
      "description": "Kolektiva API Documentation",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "CreatePropertyFacilityDto": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "facility": {
              "type": "string"
            },
            "isHighlight": {
              "type": "boolean"
            }
          },
          "required": [
            "type",
            "facility",
            "isHighlight"
          ]
        },
        "CreatePropertyImageDto": {
          "type": "object",
          "properties": {
            "image": {
              "type": "string"
            },
            "isHighlight": {
              "type": "boolean"
            }
          },
          "required": [
            "image",
            "isHighlight"
          ]
        },
        "CreatePropertyDocumentDto": {
          "type": "object",
          "properties": {
            "document": {
              "type": "string"
            },
            "isHighlight": {
              "type": "boolean"
            }
          },
          "required": [
            "document",
            "isHighlight"
          ]
        },
        "PropertyDataDto": {
          "type": "object",
          "properties": {}
        },
        "CreatePropertyDto": {
          "type": "object",
          "properties": {
            "marketAddress": {
              "type": "string"
            },
            "tokenAddress": {
              "type": "string"
            },
            "status": {
              "type": "string"
            },
            "phase": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "city": {
              "type": "string"
            },
            "state": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "tokenName": {
              "type": "string"
            },
            "tokenSymbol": {
              "type": "string"
            },
            "totalSupply": {
              "type": "number"
            },
            "salePrice": {
              "type": "number"
            },
            "createdBy": {
              "type": "string"
            },
            "updatedBy": {
              "type": "string"
            },
            "chainId": {
              "type": "number"
            },
            "isUpcoming": {
              "type": "boolean"
            },
            "isAftermarket": {
              "type": "boolean"
            },
            "facilities": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CreatePropertyFacilityDto"
              }
            },
            "images": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CreatePropertyImageDto"
              }
            },
            "documents": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CreatePropertyDocumentDto"
              }
            },
            "propertyData": {
              "$ref": "#/components/schemas/PropertyDataDto"
            }
          },
          "required": [
            "status",
            "phase",
            "address",
            "location",
            "city",
            "state",
            "country",
            "type",
            "description",
            "tokenName",
            "tokenSymbol",
            "totalSupply",
            "salePrice",
            "createdBy",
            "updatedBy",
            "chainId",
            "facilities",
            "images",
            "documents",
            "propertyData"
          ]
        },
        "UpdatePropertyDto": {
          "type": "object",
          "properties": {
            "marketAddress": {
              "type": "string"
            },
            "tokenAddress": {
              "type": "string"
            },
            "status": {
              "type": "string"
            },
            "phase": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "city": {
              "type": "string"
            },
            "state": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "tokenName": {
              "type": "string"
            },
            "tokenSymbol": {
              "type": "string"
            },
            "totalSupply": {
              "type": "number"
            },
            "salePrice": {
              "type": "number"
            },
            "createdBy": {
              "type": "string"
            },
            "updatedBy": {
              "type": "string"
            },
            "chainId": {
              "type": "number"
            },
            "isUpcoming": {
              "type": "boolean"
            },
            "isAftermarket": {
              "type": "boolean"
            },
            "facilities": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CreatePropertyFacilityDto"
              }
            },
            "images": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CreatePropertyImageDto"
              }
            },
            "documents": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CreatePropertyDocumentDto"
              }
            }
          },
          "required": [
            "status",
            "phase",
            "address",
            "location",
            "city",
            "state",
            "country",
            "type",
            "description",
            "tokenName",
            "tokenSymbol",
            "totalSupply",
            "salePrice",
            "createdBy",
            "updatedBy",
            "chainId",
            "facilities",
            "images",
            "documents"
          ]
        },
        "CreateUserPropertyDto": {
          "type": "object",
          "properties": {
            "walletAddress": {
              "type": "string"
            },
            "propertyId": {
              "type": "string"
            }
          },
          "required": [
            "walletAddress",
            "propertyId"
          ]
        },
        "SubmitPropertyListingDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "phone": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "priceEstimation": {
              "type": "number"
            },
            "propertyData": {
              "$ref": "#/components/schemas/PropertyDataDto"
            }
          },
          "required": [
            "name",
            "phone",
            "email",
            "address",
            "priceEstimation",
            "propertyData"
          ]
        },
        "AdminChangePropertyListingRequestStatusBodyDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string"
            }
          },
          "required": [
            "status"
          ]
        },
        "AdminChangeListedPropertyStatusDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string"
            }
          },
          "required": [
            "status"
          ]
        },
        "AdminChangeListedPropertyPhaseDto": {
          "type": "object",
          "properties": {
            "phase": {
              "type": "string"
            }
          },
          "required": [
            "phase"
          ]
        },
        "KolektivaCreatePropertyDto": {
          "type": "object",
          "properties": {
            "chainId": {
              "type": "number"
            },
            "tokenName": {
              "type": "string"
            },
            "tokenSymbol": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "state": {
              "type": "string"
            },
            "city": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "totalSupply": {
              "type": "number"
            },
            "salePrice": {
              "type": "number",
              "description": "Sale price with 0 decimals"
            },
            "propertyOwnerAddress": {
              "type": "string"
            }
          },
          "required": [
            "chainId",
            "tokenName",
            "tokenSymbol",
            "type",
            "country",
            "state",
            "city",
            "location",
            "totalSupply",
            "salePrice",
            "propertyOwnerAddress"
          ]
        },
        "InviteCodeBodyDto": {
          "type": "object",
          "properties": {
            "inviteCode": {
              "type": "string"
            }
          },
          "required": [
            "inviteCode"
          ]
        },
        "StoreOnBoardingStepBodyDto": {
          "type": "object",
          "properties": {
            "walletAddress": {
              "type": "string"
            },
            "step": {
              "type": "number"
            }
          },
          "required": [
            "walletAddress",
            "step"
          ]
        },
        "CreateUserActivityDto": {
          "type": "object",
          "properties": {}
        },
        "UpdateUserActivityDto": {
          "type": "object",
          "properties": {}
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
