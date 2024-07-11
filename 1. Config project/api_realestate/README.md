# Get started

Run server:

```bash
npm ci
npm run build
npm start
```

Reset data to default:

```bash
npm run restore-data

// or stop server and run it again
```


# Homy API

## Get place

### Request

**Endpoint**

| Method | URI | Description |
|--------|-----|-------------|
|GET|/places/:id/?:coordinates|Get place info.|

**Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
|id|`number`|*|ID of requesting place.|
|coordinates|`string`||Calculate place distance from this coordinates. Format `lat,lng`, example `59.9386,30.3141`.|

### Response

**`Place`**

| Property | Type | Description |
|----------|------|-------------|
|image|`string`|Cover image of place.|
|name|`string`|Place name.|
|description|`string`|Place short description.|
|remoteness|`float`|How far place is from specified coordinates in kilometers.|
|bookedDates|`number[]`|Dates which are unavailable for booking. Format `Unix timestamp`, example `1623761668832`.|

## Find places

### Request

**Endpoint**

| Method | URI | Description |
|--------|-----|-------------|
|GET|/places|Find places suitable for parameters.|

**Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
|coordinates|`string`|*|Coordinates of city to find places. Format `lat,lng`, example `59.9386,30.3141`.|
|checkInDate|`number`|*|Date of check-in. Format `Unix timestamp`, example `1623761668832`.|
|checkOutDate|`number`|*|Date of check-out. Format `Unix timestamp`, example `1623761668832`.|
|maxPrice|`number`||Max night price.|

### Response

**[`Place[]`](#response)**

## Book place

### Request

**Endpoint**

| Method | URI | Description |
|--------|-----|-------------|
|PATCH|/places/:id|Book a place.|

**Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
|id|`number`|*|Place ID to book.|
|checkInDate|`number`|*|Date of check-in. Format `Unix timestamp`, example `1623761668832`.|
|checkOutDate|`number`|*|Date of check-out. Format `Unix timestamp`, example `1623761668832`.|

### Response

**[`Place`](#response)**
