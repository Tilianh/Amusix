FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine@sha256:d8ee39817ca03a3757288e83c37ed73cc969a286c603b827c7cbe33add1c2d1c AS build
WORKDIR /App

ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG YOUTUBE_API_KEY
ARG YOUTUBE_API_APP_NAME

# Copy everything
COPY . ./

# Download JSON file editer CLI
RUN apk add jq

# Set configuration (in temp file)
RUN jq \
    --arg dbUrl "Server=amx-database;Port=5432;Database=amusix;User ID=$DATABASE_USER;Password=$DATABASE_PASSWORD" \
    --arg youtubeApiKey "$YOUTUBE_API_KEY" \
    --arg youtubeApiAppName "$YOUTUBE_API_APP_NAME" \
    '.ConnectionStrings.Default = $dbUrl | .YouTubeApi.ApiKey = $youtubeApiKey | .YouTubeApi.ApplicationName = $youtubeApiAppName' \
    appsettings.Production.json > temp-config

# Update configuration
RUN mv temp-config appsettings.Production.json

# Restore as distinct layers
RUN dotnet restore

# Build and publish release
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine@sha256:27b6b84beeede74fd16886177d360799c8e4299ceadfbd64eef57bafead7878a
WORKDIR /App

# Move application build
COPY --from=build /App/out .

# Run application
ENTRYPOINT ["dotnet", "AmusixBackapp.dll"]