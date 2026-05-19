# az managedcleanroom CLI Reference

> **Source**: [Azure/azure-cli-extensions/src/managedcleanroom](https://github.com/Azure/azure-cli-extensions/blob/main/src/managedcleanroom)
> **API Version**: `2025-10-31-preview`

---

## Table of Contents

- [1. ARM (Management Plane) Commands](#1-arm-management-plane-commands)
  - [1.1 az managedcleanroom collaboration](#11-az-managedcleanroom-collaboration)
  - [1.2 az managedcleanroom consortium](#12-az-managedcleanroom-consortium)
  - [1.3 az managedcleanroom consortium-view](#13-az-managedcleanroom-consortium-view)
  - [1.4 az managedcleanroom consortium-view contract](#14-az-managedcleanroom-consortium-view-contract)
- [2. Frontend (Data Plane) Commands](#2-frontend-data-plane-commands)
  - [2.1 az managedcleanroom frontend configure](#21-az-managedcleanroom-frontend-configure)
  - [2.2 az managedcleanroom frontend login](#22-az-managedcleanroom-frontend-login)
  - [2.3 az managedcleanroom frontend logout](#23-az-managedcleanroom-frontend-logout)
  - [2.4 az managedcleanroom frontend show](#24-az-managedcleanroom-frontend-show)
  - [2.5 az managedcleanroom frontend collaboration list](#25-az-managedcleanroom-frontend-collaboration-list)
  - [2.6 az managedcleanroom frontend workloads list](#26-az-managedcleanroom-frontend-workloads-list)
  - [2.7 az managedcleanroom frontend analytics show](#27-az-managedcleanroom-frontend-analytics-show)
  - [2.8 az managedcleanroom frontend analytics deploymentinfo](#28-az-managedcleanroom-frontend-analytics-deploymentinfo)
  - [2.9 az managedcleanroom frontend analytics cleanroompolicy](#29-az-managedcleanroom-frontend-analytics-cleanroompolicy)
  - [2.10 az managedcleanroom frontend oidc issuerinfo show](#210-az-managedcleanroom-frontend-oidc-issuerinfo-show)
  - [2.11 az managedcleanroom frontend invitation list](#211-az-managedcleanroom-frontend-invitation-list)
  - [2.12 az managedcleanroom frontend invitation show](#212-az-managedcleanroom-frontend-invitation-show)
  - [2.13 az managedcleanroom frontend invitation accept](#213-az-managedcleanroom-frontend-invitation-accept)
  - [2.14 az managedcleanroom frontend analytics dataset list](#214-az-managedcleanroom-frontend-analytics-dataset-list)
  - [2.15 az managedcleanroom frontend analytics dataset show](#215-az-managedcleanroom-frontend-analytics-dataset-show)
  - [2.16 az managedcleanroom frontend analytics dataset publish](#216-az-managedcleanroom-frontend-analytics-dataset-publish)
  - [2.17 az managedcleanroom frontend consent check](#217-az-managedcleanroom-frontend-consent-check)
  - [2.18 az managedcleanroom frontend consent set](#218-az-managedcleanroom-frontend-consent-set)
  - [2.19 az managedcleanroom frontend analytics query list](#219-az-managedcleanroom-frontend-analytics-query-list)
  - [2.20 az managedcleanroom frontend analytics query show](#220-az-managedcleanroom-frontend-analytics-query-show)
  - [2.21 az managedcleanroom frontend analytics query publish](#221-az-managedcleanroom-frontend-analytics-query-publish)
  - [2.22 az managedcleanroom frontend analytics query run](#222-az-managedcleanroom-frontend-analytics-query-run)
  - [2.23 az managedcleanroom frontend analytics query vote accept](#223-az-managedcleanroom-frontend-analytics-query-vote-accept)
  - [2.24 az managedcleanroom frontend analytics query vote reject](#224-az-managedcleanroom-frontend-analytics-query-vote-reject)
  - [2.25 az managedcleanroom frontend analytics query runhistory list](#225-az-managedcleanroom-frontend-analytics-query-runhistory-list)
  - [2.26 az managedcleanroom frontend analytics query runresult show](#226-az-managedcleanroom-frontend-analytics-query-runresult-show)
  - [2.27 az managedcleanroom frontend analytics auditevent list](#227-az-managedcleanroom-frontend-analytics-auditevent-list)
  - [2.28 az managedcleanroom frontend attestation cgs](#228-az-managedcleanroom-frontend-attestation-cgs)
  - [2.29 az managedcleanroom frontend analytics attestationreport cleanroom](#229-az-managedcleanroom-frontend-analytics-attestationreport-cleanroom)

---

## 1. ARM (Management Plane) Commands

These commands are auto-generated via aaz-dev-tools and operate on the Azure Resource Manager plane.

Resource path pattern: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CleanRoom/...`

### Common ARM Response Schema (Collaboration Resource)

All collaboration ARM commands that return a resource share this schema:

```json
{
  "id": "string (read-only)",
  "name": "string (read-only)",
  "type": "string (read-only)",
  "location": "string (required)",
  "kind": "string",
  "tags": { "<key>": "string" },
  "properties": {
    "clusterEndpoint": "string (read-only)",
    "consortiumArmId": "string (read-only)",
    "consortiumType": "string (required, e.g. 'ConfidentialACI')",
    "health": {
      "healthState": "string (required)",
      "healthIssues": [
        {
          "code": "string (required)",
          "message": "string (required)"
        }
      ]
    },
    "managedOnBehalfOfConfiguration": {
      "moboBrokerResources": [
        { "id": "string" }
      ]
    },
    "provisioningState": "string (read-only)",
    "userIdentity": {
      "accountType": "string (required)",
      "objectId": "string (required)",
      "tenantId": "string (required)"
    },
    "workloads": [
      {
        "endpoint": "string (required)",
        "namespace": "string (required)",
        "workloadType": "string (required)"
      }
    ]
  },
  "systemData": {
    "createdAt": "string",
    "createdBy": "string",
    "createdByType": "string",
    "lastModifiedAt": "string",
    "lastModifiedBy": "string",
    "lastModifiedByType": "string"
  }
}
```

---

### 1.1 az managedcleanroom collaboration

Source: `aaz/latest/managedcleanroom/collaboration/__init__.py`

#### az managedcleanroom collaboration create

- **Description**: Create a collaboration.
- **Supports `--no-wait`**: Yes (LRO)
- **Resource Path**: `PUT /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/collaborations/{}`
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required, pattern: `^[a-zA-Z0-9]$|^[a-zA-Z0-9][-_a-zA-Z0-9]{0,61}[a-zA-Z0-9]$`)
  - `--location` (required)
  - `--consortium-type` (required, e.g. `ConfidentialACI`)
  - `--user-identity` (required, JSON: `{tenant-id, object-id, account-type}`)
  - `--tags`
  - `--kind`
- **Example**:
  ```
  az managedcleanroom collaboration create --resource-group testrg --collaboration-name ContosoCollaboration --location northeurope --consortium-type ConfidentialACI --user-identity "{tenant-id:fd3c3665-...,object-id:fd3c3665-...,account-type:microsoft}"
  ```
- **Return Value**: Collaboration Resource (see [Common ARM Response Schema](#common-arm-response-schema-collaboration-resource))

---

#### az managedcleanroom collaboration show

- **Description**: Get a collaboration.
- **Resource Path**: `GET /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/collaborations/{}`
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required)
- **Example**:
  ```
  az managedcleanroom collaboration show --resource-group testrg --collaboration-name ContosoCollaboration
  ```
- **Return Value**: Collaboration Resource (see [Common ARM Response Schema](#common-arm-response-schema-collaboration-resource))

---

#### az managedcleanroom collaboration list

- **Description**: List collaborations.
- **Resource Path**: `GET /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/collaborations`
- **Parameters**:
  - `--resource-group` (required)
- **Return Value**: Array of Collaboration Resources (paginated with `nextLink`)
  ```json
  {
    "value": [ /* Array of Collaboration Resource objects */ ],
    "nextLink": "string"
  }
  ```

---

#### az managedcleanroom collaboration delete

- **Description**: Delete a collaboration. Prompts for confirmation.
- **Supports `--no-wait`**: Yes (LRO)
- **Resource Path**: `DELETE /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/collaborations/{}`
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required)
- **Example**:
  ```
  az managedcleanroom collaboration delete --resource-group testrg --collaboration-name ContosoCollaboration
  ```
- **Return Value**: None (HTTP 202/204)

---

#### az managedcleanroom collaboration add-collaborator

- **Description**: Adds a collaborator to a collaboration.
- **Supports `--no-wait`**: Yes (LRO)
- **Resource Path**: `POST /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/collaborations/{}/addCollaborator`
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required)
  - `--email` (required)
- **Example**:
  ```
  az managedcleanroom collaboration add-collaborator --resource-group testrg --collaboration-name ContosoCollaboration --email alice@example.com
  ```
- **Return Value**: Collaboration Resource (see [Common ARM Response Schema](#common-arm-response-schema-collaboration-resource))

---

#### az managedcleanroom collaboration enable-workload

- **Description**: Enables a workload on a collaboration.
- **Supports `--no-wait`**: Yes (LRO)
- **Resource Path**: `POST /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/collaborations/{}/enableWorkload`
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required)
  - `--workload-type` (required, enum: `analytics`)
- **Example**:
  ```
  az managedcleanroom collaboration enable-workload --resource-group testrg --collaboration-name ContosoCollaboration --workload-type analytics
  ```
- **Return Value**: Collaboration Resource (see [Common ARM Response Schema](#common-arm-response-schema-collaboration-resource))

---

#### az managedcleanroom collaboration pause

- **Description**: Pause a collaboration.
- **Supports `--no-wait`**: Yes (LRO)
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required)
- **Return Value**: Collaboration Resource (see [Common ARM Response Schema](#common-arm-response-schema-collaboration-resource))

---

#### az managedcleanroom collaboration resume

- **Description**: Resume a collaboration.
- **Supports `--no-wait`**: Yes (LRO)
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required)
- **Return Value**: Collaboration Resource (see [Common ARM Response Schema](#common-arm-response-schema-collaboration-resource))

---

#### az managedcleanroom collaboration recover

- **Description**: Recover a collaboration.
- **Supports `--no-wait`**: Yes (LRO)
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required)
- **Return Value**: Collaboration Resource (see [Common ARM Response Schema](#common-arm-response-schema-collaboration-resource))

---

#### az managedcleanroom collaboration update

- **Description**: Update a collaboration.
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required)
  - _(tag and property updates)_
- **Return Value**: Collaboration Resource (see [Common ARM Response Schema](#common-arm-response-schema-collaboration-resource))

---

#### az managedcleanroom collaboration wait

- **Description**: Place the CLI in a waiting state until a condition is met.
- **Parameters**:
  - `--resource-group` (required)
  - `--collaboration-name` (required)
  - `--created`, `--custom`, `--deleted`, `--exists`, `--interval`, `--timeout`, `--updated` (standard wait flags)
- **Return Value**: None (blocks until condition met)

---

### 1.2 az managedcleanroom consortium

Source: `aaz/latest/managedcleanroom/consortium/__init__.py`

#### Common Consortium ARM Response Schema

```json
{
  "id": "string (read-only)",
  "name": "string (read-only)",
  "type": "string (read-only)",
  "location": "string (required)",
  "kind": "string",
  "tags": { "<key>": "string" },
  "properties": {
    "consortiumType": "string",
    "endpoint": "string (read-only)",
    "health": {
      "healthState": "string (required)",
      "healthIssues": [
        {
          "code": "string (required)",
          "message": "string (required)"
        }
      ]
    },
    "managedOnBehalfOfConfiguration": {
      "moboBrokerResources": [
        { "id": "string" }
      ]
    },
    "members": [
      {
        "certificatePem": "string (required)",
        "encryptionKeyPem": "string",
        "identifier": "string (read-only)"
      }
    ],
    "provisioningState": "string (read-only)",
    "serviceCertificatePem": "string (read-only)"
  },
  "systemData": {
    "createdAt": "string",
    "createdBy": "string",
    "createdByType": "string",
    "lastModifiedAt": "string",
    "lastModifiedBy": "string",
    "lastModifiedByType": "string"
  }
}
```

---

#### az managedcleanroom consortium create

- **Description**: Create a consortium.
- **Supports `--no-wait`**: Yes (LRO)
- **Resource Path**: `PUT /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/consortiums/{}`
- **Parameters**:
  - `--resource-group` (required)
  - `--consortium-name` / `-n` / `--name` (required)
  - `--location` (required)
  - `--consortium-type`
  - `--members` (JSON array)
  - `--tags`
- **Example**:
  ```
  az managedcleanroom consortium create --resource-group testrg --consortium-name ContosoConsortium --location northeurope
  ```
- **Return Value**: Consortium Resource (see [Common Consortium ARM Response Schema](#common-consortium-arm-response-schema))

---

#### az managedcleanroom consortium show

- **Description**: Get a consortium.
- **Resource Path**: `GET /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/consortiums/{}`
- **Parameters**:
  - `--resource-group` (required)
  - `--consortium-name` / `-n` / `--name` (required)
- **Return Value**: Consortium Resource (see [Common Consortium ARM Response Schema](#common-consortium-arm-response-schema))

---

#### az managedcleanroom consortium list

- **Description**: List consortiums.
- **Resource Path**: `GET /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/consortiums`
- **Parameters**:
  - `--resource-group` (required)
- **Return Value**: Array of Consortium Resources (paginated with `nextLink`)

---

#### az managedcleanroom consortium delete

- **Description**: Delete a consortium. Prompts for confirmation.
- **Supports `--no-wait`**: Yes (LRO)
- **Parameters**:
  - `--resource-group` (required)
  - `--consortium-name` / `-n` / `--name` (required)
- **Example**:
  ```
  az managedcleanroom consortium delete --resource-group testrg --consortium-name ContosoConsortium
  ```
- **Return Value**: None (HTTP 202/204)

---

#### az managedcleanroom consortium pause

- **Description**: Pause a consortium.
- **Supports `--no-wait`**: Yes (LRO)
- **Parameters**: `--resource-group`, `--consortium-name`
- **Return Value**: Consortium Resource

---

#### az managedcleanroom consortium resume

- **Description**: Resume a consortium.
- **Supports `--no-wait`**: Yes (LRO)
- **Parameters**: `--resource-group`, `--consortium-name`
- **Return Value**: Consortium Resource

---

#### az managedcleanroom consortium recover

- **Description**: Recover a consortium.
- **Supports `--no-wait`**: Yes (LRO)
- **Parameters**: `--resource-group`, `--consortium-name`
- **Return Value**: Consortium Resource

---

#### az managedcleanroom consortium update

- **Description**: Update a consortium.
- **Parameters**: `--resource-group`, `--consortium-name`, _(property updates)_
- **Return Value**: Consortium Resource

---

#### az managedcleanroom consortium wait

- **Description**: Place the CLI in a waiting state until a condition is met.
- **Parameters**: `--resource-group`, `--consortium-name`, standard wait flags
- **Return Value**: None

---

### 1.3 az managedcleanroom consortium-view

Source: `aaz/latest/managedcleanroom/consortium_view/__init__.py`

#### Common Consortium-View ARM Response Schema

```json
{
  "id": "string (read-only)",
  "name": "string (read-only)",
  "type": "string (read-only)",
  "location": "string (required)",
  "kind": "string",
  "tags": { "<key>": "string" },
  "properties": {
    "consortiumEndpoint": "string (required)",
    "consortiumServiceCertificatePem": "string (required)",
    "member": {
      "certificatePem": "string (required)",
      "identifier": "string (read-only)",
      "signedPayload": "string (secret)"
    },
    "provisioningState": "string (read-only)"
  },
  "systemData": {
    "createdAt": "string",
    "createdBy": "string",
    "createdByType": "string",
    "lastModifiedAt": "string",
    "lastModifiedBy": "string",
    "lastModifiedByType": "string"
  }
}
```

---

#### az managedcleanroom consortium-view create

- **Description**: Create a consortium view.
- **Supports `--no-wait`**: Yes (LRO)
- **Resource Path**: `PUT /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/consortiumViews/{}`
- **Parameters**:
  - `--resource-group` (required)
  - `--consortium-view-name` (required)
  - `--location` (required)
  - `--consortium-endpoint` (required)
  - `--consortium-service-certificate-pem` (required)
  - `--member` (required, JSON: `{certificate-pem}`)
  - `--tags`
- **Return Value**: Consortium-View Resource (see [Common Consortium-View ARM Response Schema](#common-consortium-view-arm-response-schema))

---

#### az managedcleanroom consortium-view show

- **Description**: Get a consortium view.
- **Resource Path**: `GET /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/consortiumViews/{}`
- **Parameters**:
  - `--resource-group` (required)
  - `--consortium-view-name` (required)
- **Return Value**: Consortium-View Resource (see [Common Consortium-View ARM Response Schema](#common-consortium-view-arm-response-schema))

---

#### az managedcleanroom consortium-view list

- **Description**: List consortium views.
- **Resource Path**: `GET /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/consortiumViews`
- **Parameters**:
  - `--resource-group` (required)
- **Return Value**: Array of Consortium-View Resources (paginated with `nextLink`)

---

#### az managedcleanroom consortium-view delete

- **Description**: Delete a consortium view. Prompts for confirmation.
- **Supports `--no-wait`**: Yes (LRO)
- **Parameters**:
  - `--resource-group` (required)
  - `--consortium-view-name` (required)
- **Return Value**: None (HTTP 202/204)

---

#### az managedcleanroom consortium-view update

- **Description**: Update a consortium view.
- **Parameters**: `--resource-group`, `--consortium-view-name`, _(property updates)_
- **Return Value**: Consortium-View Resource

---

#### az managedcleanroom consortium-view wait

- **Description**: Place the CLI in a waiting state until a condition is met.
- **Parameters**: `--resource-group`, `--consortium-view-name`, standard wait flags
- **Return Value**: None

---

### 1.4 az managedcleanroom consortium-view contract

Source: `aaz/latest/managedcleanroom/consortium_view/contract/__init__.py`

#### Common Contract ARM Response Schema

```json
{
  "id": "string (read-only)",
  "name": "string (read-only)",
  "type": "string (read-only)",
  "kind": "string",
  "properties": {
    "contractId": "string (read-only)",
    "deploymentPolicy": "string (read-only)",
    "deploymentTemplate": "string (read-only)"
  },
  "systemData": {
    "createdAt": "string",
    "createdBy": "string",
    "createdByType": "string",
    "lastModifiedAt": "string",
    "lastModifiedBy": "string",
    "lastModifiedByType": "string"
  }
}
```

---

#### az managedcleanroom consortium-view contract list

- **Description**: List contracts for a consortium view.
- **Resource Path**: `GET /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/consortiumViews/{}/contracts`
- **Parameters**:
  - `--resource-group` (required)
  - `--consortium-view-name` (required)
- **Return Value**: Array of Contract Resources (paginated with `nextLink`)

---

#### az managedcleanroom consortium-view contract show

- **Description**: Get a contract.
- **Resource Path**: `GET /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/consortiumViews/{}/contracts/{}`
- **Parameters**:
  - `--resource-group` (required)
  - `--consortium-view-name` (required)
  - `--contract-name` (required)
- **Example**:
  ```
  az managedcleanroom consortium-view contract show --resource-group testrg --consortium-view-name ContosoConsortiumView --contract-name ContosoContract
  ```
- **Return Value**: Contract Resource (see [Common Contract ARM Response Schema](#common-contract-arm-response-schema))

---

#### az managedcleanroom consortium-view contract propose-template

- **Description**: Generates and proposes contract template.
- **Supports `--no-wait`**: Yes (LRO)
- **Resource Path**: `POST /subscriptions/{}/resourceGroups/{}/providers/Microsoft.CleanRoom/consortiumViews/{}/contracts/{}/proposeTemplate`
- **Parameters**:
  - `--resource-group` (required)
  - `--consortium-view-name` (required)
  - `--contract-name` (required)
- **Example**:
  ```
  az managedcleanroom consortium-view contract propose-template --resource-group testrg --consortium-view-name ContosoConsortiumView --contract-name ContosoContract
  ```
- **Return Value**: Contract Resource (see [Common Contract ARM Response Schema](#common-contract-arm-response-schema))

---

## 2. Frontend (Data Plane) Commands

These commands interact with the Analytics Frontend API. They are registered in `_frontend_commands.py` and implemented in `_frontend_custom.py`. Response schemas come from `analytics_frontend_api/operations/_operations.py`.

**Authentication**: Supports two methods:
1. MSAL device code flow (`az managedcleanroom frontend login`)
2. Azure CLI authentication (`az login`)

**Configuration**: Must set the API endpoint URL before using these commands.

**Common Error Response (HTTP 422)**:
```json
{
  "loc": [ {} ],
  "msg": "string",
  "type": "string"
}
```

---

### 2.1 az managedcleanroom frontend configure

- **Description**: Configure Analytics Frontend API settings. Displays current configuration if called without options.
- **Parameters**:
  - `--endpoint` (optional) — API endpoint URL
  - `--auth-scope` (optional) — Custom auth scope
- **Configuration Sources** (checked in order):
  1. Environment variables: `MANAGEDCLEANROOM_ENDPOINT`
  2. Azure CLI config (persistent): `managedcleanroom-frontend.client_id`, `managedcleanroom-frontend.tenant_id`, `managedcleanroom-frontend.scopes`, `managedcleanroom-frontend.auth_scope`, `managedcleanroom-frontend.endpoint`
- **Example**:
  ```
  az managedcleanroom frontend configure --endpoint https://api.example.com
  az managedcleanroom frontend configure --auth-scope https://cleanroom.azure.net/
  ```
- **Return Value**: Current configuration object (JSON)

---

### 2.2 az managedcleanroom frontend login

- **Description**: Authenticate using Microsoft device code flow via MSAL.
- **Parameters**:
  - `--use-microsoft-identity` (optional, flag)
- **Return Value**: Authentication status / token info

---

### 2.3 az managedcleanroom frontend logout

- **Description**: Log out and clear cached credentials.
- **Parameters**: None
- **Return Value**: Logout confirmation

---

### 2.4 az managedcleanroom frontend show

- **Description**: Show collaboration details (via Frontend API).
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.id_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend show --collaboration-id <id>
  ```
- **Return Value**: JSON — Collaboration details object

---

### 2.5 az managedcleanroom frontend collaboration list

- **Description**: List all collaborations.
- **Parameters**: None
- **API call**: `collaboration.list()`
- **Example**:
  ```
  az managedcleanroom frontend collaboration list
  ```
- **Return Value**:
  ```json
  [
    "string",
    "string"
  ]
  ```
  Array of collaboration ID strings.

---

### 2.6 az managedcleanroom frontend workloads list

- **Description**: List workloads for a collaboration.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.workloads_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend workloads list -c <collaboration-id>
  ```
- **Return Value**:
  ```json
  [
    "string"
  ]
  ```
  Array of workload name strings, or JSON object.

---

### 2.7 az managedcleanroom frontend analytics show

- **Description**: Show analytics information for a collaboration.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.analytics_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend analytics show -c <collaboration-id>
  ```
- **Return Value**: JSON — Analytics configuration object

---

### 2.8 az managedcleanroom frontend analytics deploymentinfo

- **Description**: Get deployment information for analytics workload.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.analytics_deployment_info_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend analytics deploymentinfo -c <collaboration-id>
  ```
- **Return Value**: JSON — Deployment info object

---

### 2.9 az managedcleanroom frontend analytics cleanroompolicy

- **Description**: Get cleanroom policy for analytics workload.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.analytics_cleanroompolicy_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend analytics cleanroompolicy -c <collaboration-id>
  ```
- **Return Value**: JSON — Cleanroom policy object

---

### 2.10 az managedcleanroom frontend oidc issuerinfo show

- **Description**: Show OIDC issuer information.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.oidc_issuer_info_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend oidc issuerinfo show -c <collaboration-id>
  ```
- **Return Value**: JSON — OIDC issuer information object

---

### 2.11 az managedcleanroom frontend invitation list

- **Description**: List invitations for a collaboration.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.invitations_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend invitation list -c <collaboration-id>
  ```
- **Return Value**:
  ```json
  [
    "string"
  ]
  ```
  Array of invitation ID strings.

---

### 2.12 az managedcleanroom frontend invitation show

- **Description**: Show invitation details.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--invitation-id` / `-i` (required)
- **API call**: `collaboration.invitation_id_get(collaboration_id, invitation_id)`
- **Example**:
  ```
  az managedcleanroom frontend invitation show -c <cid> -i <invitation-id>
  ```
- **Return Value**: JSON — Invitation detail object

---

### 2.13 az managedcleanroom frontend invitation accept

- **Description**: Accept an invitation.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--invitation-id` / `-i` (required)
- **API call**: `collaboration.invitation_id_accept_post(collaboration_id, invitation_id)`
- **Example**:
  ```
  az managedcleanroom frontend invitation accept -c <cid> -i <invitation-id>
  ```
- **Return Value**: JSON or empty — Acceptance result

---

### 2.14 az managedcleanroom frontend analytics dataset list

- **Description**: List datasets for a collaboration.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.analytics_datasets_list_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend analytics dataset list -c <collaboration-id>
  ```
- **Return Value**:
  ```json
  [
    "string"
  ]
  ```
  Array of dataset document ID strings.

---

### 2.15 az managedcleanroom frontend analytics dataset show

- **Description**: Show dataset details.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
- **API call**: `collaboration.analytics_dataset_document_id_get(collaboration_id, document_id)`
- **Example**:
  ```
  az managedcleanroom frontend analytics dataset show -c <cid> -d <document-id>
  ```
- **Return Value**:
  ```json
  {
    "data": {
      "datasetAccessPoint": {
        "name": "string",
        "path": "string",
        "protection": {
          "proxyMode": "string",
          "proxyType": "string",
          "configuration": "string",
          "encryptionSecretAccessIdentity": {
            "clientId": "string",
            "name": "string",
            "tenantId": "string",
            "tokenIssuer": {}
          },
          "encryptionSecrets": {
            "dek": {
              "name": "string",
              "secret": {
                "backingResource": {
                  "id": "string",
                  "name": "string",
                  "provider": {
                    "protocol": "string",
                    "url": "string",
                    "configuration": ""
                  },
                  "type": "string"
                },
                "secretType": "string"
              }
            },
            "kek": {
              "name": "string",
              "secret": {
                "backingResource": {
                  "id": "string",
                  "name": "string",
                  "provider": {
                    "protocol": "string",
                    "url": "string",
                    "configuration": ""
                  },
                  "type": "string"
                },
                "secretType": "string"
              }
            }
          }
        }
      },
      "privacyPolicy": {
        "policy": {}
      }
    },
    "store": {
      "id": "string",
      "name": "string",
      "provider": {
        "protocol": "string",
        "url": "string",
        "configuration": ""
      },
      "type": "string"
    },
    "type": "string",
    "identity": {
      "clientId": "string",
      "name": "string",
      "tenantId": "string",
      "tokenIssuer": {}
    },
    "datasetAccessPolicy": {
      "accessMode": "string",
      "allowedFields": []
    },
    "datasetSchema": {
      "fields": [
        {
          "name": "string",
          "type": "string"
        }
      ]
    }
  }
  ```

---

### 2.16 az managedcleanroom frontend analytics dataset publish

- **Description**: Publish a dataset.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
  - `--body` (required) — JSON string or `@file` path
- **API call**: `collaboration.analytics_dataset_document_id_publish_post(collaboration_id, document_id, body=body)`
- **Example**:
  ```
  az managedcleanroom frontend analytics dataset publish -c <cid> --document-id <document-id> --body '{"data": {"datasetAccessPoint": {"name": "my-dataset", "path": "/data/path", "protection": {}}}}'
  ```
- **Request Body**:
  ```json
  {
    "data": {
      "datasetAccessPoint": {
        "name": "string",
        "path": "string",
        "protection": { }
      }
    }
  }
  ```
- **Return Value**: JSON or empty — Publish confirmation

---

### 2.17 az managedcleanroom frontend consent check

- **Description**: Check execution consent by ID of the query or dataset.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
- **API call**: `collaboration.check_consent_document_id_get(collaboration_id, document_id)`
- **Example**:
  ```
  az managedcleanroom frontend consent check -c <cid> --document-id <doc-id>
  ```
- **Return Value**:
  ```json
  {
    "status": "string",
    "reason": {
      "code": "string",
      "message": "string"
    }
  }
  ```

---

### 2.18 az managedcleanroom frontend consent set

- **Description**: Set consent document action (enable/disable).
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
  - `--consent-action` / `-a` (required, e.g. `enable` or `disable`)
- **API call**: `collaboration.set_consent_document_id_consent_action_post(collaboration_id, document_id, consent_action)`
- **Example**:
  ```
  az managedcleanroom frontend consent set -c <cid> --document-id <doc-id> --consent-action enable
  az managedcleanroom frontend consent set -c <cid> --document-id <doc-id> --consent-action disable
  ```
- **Return Value**: JSON or empty — Action result

---

### 2.19 az managedcleanroom frontend analytics query list

- **Description**: List queries for a collaboration.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.analytics_queries_list_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend analytics query list -c <collaboration-id>
  ```
- **Return Value**:
  ```json
  [
    "string"
  ]
  ```
  Array of query document ID strings.

---

### 2.20 az managedcleanroom frontend analytics query show

- **Description**: Show query details.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
- **API call**: `collaboration.analytics_queries_document_id_get(collaboration_id, document_id)`
- **Example**:
  ```
  az managedcleanroom frontend analytics query show -c <cid> -d <document-id>
  ```
- **Return Value**:
  ```json
  {
    "approvers": [
      {
        "approverId": "string",
        "approverIdType": "string"
      }
    ],
    "data": {
      "applicationType": "string",
      "inputDataset": [
        {
          "specification": "..."
        }
      ]
    }
  }
  ```

---

### 2.21 az managedcleanroom frontend analytics query publish

- **Description**: Publish a query.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
  - `--body` (required) — JSON string or `@file` path
- **API call**: `collaboration.analytics_queries_document_id_publish_post(collaboration_id, document_id, body=body)`
- **Example**:
  ```
  az managedcleanroom frontend analytics query publish -c <cid> --document-id <document-id> --body @query-config.json
  ```
- **Request Body**:
  ```json
  {
    "inputDatasets": [
      {
        "datasetDocumentId": "string",
        "view": "string"
      }
    ],
    "outputDataset": {
      "datasetDocumentId": "string",
      "view": "string"
    },
    "queryData": {
      "segments": [
        {
          "data": "string",
          "executionSequence": 0,
          "postFilters": [
            {
              "columnName": "string",
              "value": "string"
            }
          ],
          "preConditions": [
            {
              "minRowCount": 0,
              "viewName": "string"
            }
          ]
        }
      ]
    }
  }
  ```
- **Return Value**: JSON or empty — Publish confirmation

---

### 2.22 az managedcleanroom frontend analytics query run

- **Description**: Run a query. Auto-generates `runId` if not provided in body.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
  - `--body` (optional) — JSON string or `@file` path
- **API call**: `collaboration.analytics_queries_document_id_run_post(collaboration_id, document_id, body=body)`
- **Example**:
  ```
  az managedcleanroom frontend analytics query run -c <cid> --document-id <document-id>
  az managedcleanroom frontend analytics query run -c <cid> --document-id <document-id> --body '{"dryRun": true}'
  ```
- **Request Body** (optional):
  ```json
  {
    "runId": "string (auto-generated UUID if not provided)",
    "dryRun": false,
    "startDate": "string",
    "endDate": "string",
    "useOptimizer": false
  }
  ```
- **Return Value**:
  ```json
  {
    "jobId": "string",
    "status": "string",
    "dryRun": false,
    "jobIdField": "string",
    "optimizationUsed": false,
    "reasoning": "string",
    "skuSettings": {
      "driver": {
        "cores": 0,
        "memory": "string",
        "serviceAccount": "string"
      },
      "executor": {
        "cores": 0,
        "deleteOnTermination": false,
        "instances": {
          "max": 0,
          "min": 0
        },
        "memory": "string"
      }
    },
    "x-ms-client-request-id": "string",
    "x-ms-correlation-id": "string"
  }
  ```

---

### 2.23 az managedcleanroom frontend analytics query vote accept

- **Description**: Accept a query vote.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
  - `--body` (optional) — JSON string or `@file` path
- **API call**: `collaboration.analytics_queries_document_id_vote_accept_post(collaboration_id, document_id, body=body)`
- **Example**:
  ```
  az managedcleanroom frontend analytics query vote accept -c <cid> --document-id <document-id> --body '{"proposalId": "..."}'
  ```
- **Request Body**:
  ```json
  {
    "proposalId": "string"
  }
  ```
- **Return Value**: JSON — Vote result

---

### 2.24 az managedcleanroom frontend analytics query vote reject

- **Description**: Reject a query vote.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
  - `--body` (optional) — JSON string or `@file` path
- **API call**: `collaboration.analytics_queries_document_id_vote_reject_post(collaboration_id, document_id, body=body)`
- **Example**:
  ```
  az managedcleanroom frontend analytics query vote reject -c <cid> --document-id <document-id> --body @vote-config.json
  ```
- **Request Body**:
  ```json
  {
    "proposalId": "string"
  }
  ```
- **Return Value**: JSON — Vote result

---

### 2.25 az managedcleanroom frontend analytics query runhistory list

- **Description**: List query run history.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--document-id` / `-d` (required)
- **API call**: `collaboration.analytics_queries_document_id_runhistory_get(collaboration_id, document_id)`
- **Example**:
  ```
  az managedcleanroom frontend analytics query runhistory list -c <cid> --document-id <document-id>
  ```
- **Return Value**:
  ```json
  [
    {
      "data": {},
      "queryId": "string",
      "runId": "string"
    }
  ]
  ```
  Array of run history entries.

---

### 2.26 az managedcleanroom frontend analytics query runresult show

- **Description**: Show details of a query run result. This retrieves the status and results of a specific query execution job.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
  - `--job-id` / `-j` (required)
- **API call**: `collaboration.analytics_queries_jobid_get(collaboration_id, jobid)`
- **Example**:
  ```
  az managedcleanroom frontend analytics query runresult show -c <cid> --job-id <job-id>
  ```
- **Return Value**:
  ```json
  {
    "events": [
      {
        "message": "string",
        "reason": "string",
        "type": "string",
        "count": 0,
        "firstTimestamp": "2020-02-20 00:00:00",
        "lastTimestamp": "2020-02-20 00:00:00",
        "name": "string"
      }
    ],
    "jobId": "string",
    "status": {
      "applicationState": {
        "state": "string"
      },
      "terminationTime": "2020-02-20 00:00:00"
    }
  }
  ```

---

### 2.27 az managedcleanroom frontend analytics auditevent list

- **Description**: List audit events for a collaboration.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.analytics_auditevents_get(collaboration_id)`
- **Example**:
  ```
  az managedcleanroom frontend analytics auditevent list -c <collaboration-id>
  ```
- **Return Value**:
  ```json
  [
    { /* audit event JSON objects */ }
  ]
  ```
  Array of audit event JSON objects.

---

### 2.28 az managedcleanroom frontend attestation cgs

- **Description**: Get CGS attestation report.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.attestationreport_cgs_get(collaboration_id)`
- **Return Value**: JSON — CGS attestation report object

---

### 2.29 az managedcleanroom frontend analytics attestationreport cleanroom

- **Description**: Get attestation report from Cleanroom.
- **Parameters**:
  - `--collaboration-id` / `-c` (required)
- **API call**: `collaboration.attestationreport_cleanroom_get(collaboration_id)`
- **Return Value**:
  ```json
  {
    "platform": "string",
    "reportDataPayload": "string",
    "report": {
      "attestation": "string",
      "platformCertificates": "string",
      "uvmEndorsements": "string"
    }
  }
  ```

---

## Summary: Complete Command Count

| Category | Commands |
|---|---|
| `az managedcleanroom collaboration` | create, show, list, delete, add-collaborator, enable-workload, pause, resume, recover, update, wait (**11**) |
| `az managedcleanroom consortium` | create, show, list, delete, pause, resume, recover, update, wait (**9**) |
| `az managedcleanroom consortium-view` | create, show, list, delete, update, wait (**6**) |
| `az managedcleanroom consortium-view contract` | list, show, propose-template (**3**) |
| `az managedcleanroom frontend` (config/auth) | configure, login, logout, show (**4**) |
| `az managedcleanroom frontend collaboration` | list (**1**) |
| `az managedcleanroom frontend workloads` | list (**1**) |
| `az managedcleanroom frontend analytics` | show, deploymentinfo, cleanroompolicy (**3**) |
| `az managedcleanroom frontend oidc issuerinfo` | show (**1**) |
| `az managedcleanroom frontend invitation` | list, show, accept (**3**) |
| `az managedcleanroom frontend analytics dataset` | list, show, publish (**3**) |
| `az managedcleanroom frontend consent` | check, set (**2**) |
| `az managedcleanroom frontend analytics query` | list, show, publish, run (**4**) |
| `az managedcleanroom frontend analytics query vote` | accept, reject (**2**) |
| `az managedcleanroom frontend analytics query runhistory` | list (**1**) |
| `az managedcleanroom frontend analytics query runresult` | show (**1**) |
| `az managedcleanroom frontend analytics auditevent` | list (**1**) |
| `az managedcleanroom frontend attestation` | cgs (**1**) |
| `az managedcleanroom frontend analytics attestationreport` | cleanroom (**1**) |
| **Total** | **58 commands** |
