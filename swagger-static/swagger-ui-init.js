
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
      "/newsletter/subscribe": {
        "post": {
          "operationId": "NewsletterController_subscribe",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubscribeDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully subscribe!"
            }
          },
          "tags": [
            "Newsletter"
          ]
        }
      },
      "/quest/available": {
        "get": {
          "operationId": "QuestController_available",
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
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully retrieve data!"
            }
          },
          "tags": [
            "Quest"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/quest/completed": {
        "get": {
          "operationId": "QuestController_completed",
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
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully retrieve data!"
            }
          },
          "tags": [
            "Quest"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/quest/complete-quest": {
        "post": {
          "operationId": "QuestController_completeQuest",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CompleteQuestBodyDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully complete quest!"
            }
          },
          "tags": [
            "Quest"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/quest/leaderboards": {
        "get": {
          "operationId": "QuestController_leaderboards",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Successfully retrieve leadeboards!"
            }
          },
          "tags": [
            "Quest"
          ],
          "security": [
            {
              "bearer": []
            }
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
      "/playground/image-generator": {
        "post": {
          "operationId": "PlaygroundController_generateImage",
          "summary": "Generate Image",
          "description": "Generates an image based on the provided input data.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ImageGeneratorDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully generated image!"
            }
          },
          "tags": [
            "Playground"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/playground/image-analyzer": {
        "post": {
          "operationId": "PlaygroundController_analyzeImage",
          "summary": "Analyze Image",
          "description": "Analyzes an image based on the provided input data.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ImageAnalyzerDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully analyzed image!"
            }
          },
          "tags": [
            "Playground"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/playground/chat": {
        "post": {
          "operationId": "ChatController_createNewSession",
          "summary": "Create New Chat Session",
          "description": "Creates a new chat session based on the provided input data.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputChatSessionDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully create chat session!"
            }
          },
          "tags": [
            "Playground"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "ChatController_findAllSessions",
          "summary": "Find All Chat Sessions",
          "description": "Finds all chat sessions based on the provided input data.",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Successfully find all chat sessions!"
            }
          },
          "tags": [
            "Playground"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/playground/chat/{sessionId}": {
        "get": {
          "operationId": "ChatController_findOneSession",
          "summary": "Find One Chat Session",
          "description": "Finds a single chat session along with its associated messages based on the provided input data.",
          "parameters": [
            {
              "name": "sessionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully find chat session!"
            }
          },
          "tags": [
            "Playground"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "patch": {
          "operationId": "ChatController_updateSession",
          "summary": "Update Chat Session",
          "description": "Updates a chat session based on the provided input data.",
          "parameters": [
            {
              "name": "sessionId",
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
                  "$ref": "#/components/schemas/UpdateChatSessionDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully update chat session!"
            }
          },
          "tags": [
            "Playground"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "post": {
          "operationId": "ChatController_addMessage",
          "summary": "Add Chat Message",
          "description": "Adds a message to a chat session based on the provided input data.",
          "parameters": [
            {
              "name": "sessionId",
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
                  "$ref": "#/components/schemas/InputChatSessionDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully add chat message!"
            }
          },
          "tags": [
            "Playground"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "ChatController_deleteSession",
          "summary": "Delete Chat Session",
          "description": "Deletes a chat session based on the provided input data.",
          "parameters": [
            {
              "name": "sessionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully delete chat session!"
            }
          },
          "tags": [
            "Playground"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/point/faucet": {
        "post": {
          "operationId": "PointController_faucet",
          "summary": "Faucet Points",
          "description": "Adds points to the user account in development environment.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PointDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully faucet points!"
            }
          },
          "tags": [
            "Point"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/digital-collection/list": {
        "get": {
          "operationId": "DigitalCollectionController_list",
          "summary": "List Digital Collections",
          "description": "Retrieves a list of digital collections.",
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
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully retrieve data!"
            }
          },
          "tags": [
            "Digital Collection"
          ]
        }
      },
      "/digital-collection/owned-list": {
        "get": {
          "operationId": "DigitalCollectionController_ownedList",
          "summary": "List Owned Digital Collections",
          "description": "Retrieves a list of digital collections owned by the user.",
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
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully retrieve data!"
            }
          },
          "tags": [
            "Digital Collection"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/digital-collection/create": {
        "post": {
          "operationId": "DigitalCollectionController_create",
          "summary": "Create Digital Collection",
          "description": "Creates a new digital collection.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateDigitalCollectionDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully create data!"
            }
          },
          "tags": [
            "Digital Collection"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/digital-collection/detail/{identifier}": {
        "get": {
          "operationId": "DigitalCollectionController_detail",
          "summary": "Get Digital Collection Detail",
          "description": "Retrieves the details of a specific digital collection.",
          "parameters": [
            {
              "name": "identifier",
              "required": true,
              "in": "path",
              "description": "Digital Collection Identifier",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully retrieve data!"
            }
          },
          "tags": [
            "Digital Collection"
          ]
        }
      },
      "/digital-collection/check-slug": {
        "get": {
          "operationId": "DigitalCollectionController_checkSlug",
          "summary": "Check Digital Collection Slug",
          "description": "Checks if a slug for a digital collection is available.",
          "parameters": [
            {
              "name": "slug",
              "required": true,
              "in": "query",
              "description": "Slug to check for uniqueness",
              "example": "cute-dragon",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully check slug for digital collection!"
            }
          },
          "tags": [
            "Digital Collection"
          ]
        }
      },
      "/image-vector": {
        "post": {
          "operationId": "ImageVectorController_upsertImage",
          "summary": "Upsert New Image Vector",
          "description": "Creates a new chat session based on the provided input data.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ImageVectorUpsertDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully upsert image vector!"
            }
          },
          "tags": [
            "Cortex"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "ImageVectorController_fetchByIds",
          "summary": "Fetch Image Vectors by IDs",
          "description": "Fetches image vectors based on the provided IDs.",
          "parameters": [
            {
              "name": "ids",
              "required": true,
              "in": "query",
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully fetch image vectors by IDs!"
            }
          },
          "tags": [
            "Cortex"
          ]
        }
      },
      "/image-vector/list": {
        "get": {
          "operationId": "ImageVectorController_listImageVectors",
          "summary": "List Image Vectors",
          "description": "Lists image vectors based on the provided options.",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Successfully list image vectors!"
            }
          },
          "tags": [
            "Cortex"
          ]
        }
      },
      "/image-vector/search-by-text": {
        "post": {
          "operationId": "ImageVectorController_searchByText",
          "summary": "Search Image Vectors by Text",
          "description": "Searches image vectors based on the provided text.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ImageVectorQueryByTextDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully search image vectors by text!"
            }
          },
          "tags": [
            "Cortex"
          ]
        }
      },
      "/image-vector/search-by-image": {
        "post": {
          "operationId": "ImageVectorController_searchByImage",
          "summary": "Search Image Vectors by Image",
          "description": "Searches image vectors based on the provided image.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ImageVectorQueryByImageDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully search image vectors by image!"
            }
          },
          "tags": [
            "Cortex"
          ]
        }
      }
    },
    "info": {
      "title": "Tenzro API",
      "description": "Tenzro API specs",
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
        "SubscribeDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "CompleteQuestBodyDto": {
          "type": "object",
          "properties": {
            "questId": {
              "type": "string"
            },
            "timestamp": {
              "type": "number"
            },
            "signature": {
              "type": "string"
            }
          },
          "required": [
            "questId",
            "timestamp",
            "signature"
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
        "ImageGeneratorDto": {
          "type": "object",
          "properties": {
            "input": {
              "type": "string"
            },
            "config": {
              "type": "object"
            }
          },
          "required": [
            "input"
          ]
        },
        "ImageAnalyzerDto": {
          "type": "object",
          "properties": {
            "input": {
              "type": "string"
            },
            "includeVectorId": {
              "type": "boolean"
            }
          }
        },
        "InputChatSessionDto": {
          "type": "object",
          "properties": {
            "input": {
              "type": "string"
            }
          },
          "required": [
            "input"
          ]
        },
        "UpdateChatSessionDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            }
          },
          "required": [
            "title"
          ]
        },
        "PointDto": {
          "type": "object",
          "properties": {
            "point": {
              "format": "int64",
              "type": "integer"
            }
          },
          "required": [
            "point"
          ]
        },
        "CreateDigitalCollectionDto": {
          "type": "object",
          "properties": {
            "slug": {
              "type": "string"
            },
            "banner": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            },
            "contractAddress": {
              "type": "string"
            }
          },
          "required": [
            "collectionName",
            "contractAddress"
          ]
        },
        "ImageVectorUpsertDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "vectorId": {
              "type": "string"
            },
            "imageUrl": {
              "type": "string"
            },
            "context": {
              "type": "string"
            },
            "metadata": {
              "type": "object"
            }
          },
          "required": [
            "name",
            "imageUrl",
            "context"
          ]
        },
        "ImageVectorQueryByTextDto": {
          "type": "object",
          "properties": {
            "filter": {
              "type": "object"
            },
            "topK": {
              "type": "number"
            },
            "threshold": {
              "type": "number"
            },
            "search": {
              "type": "string"
            }
          },
          "required": [
            "search"
          ]
        },
        "ImageVectorQueryByImageDto": {
          "type": "object",
          "properties": {
            "filter": {
              "type": "object"
            },
            "topK": {
              "type": "number"
            },
            "threshold": {
              "type": "number"
            }
          }
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
