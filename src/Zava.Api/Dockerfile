# --- Build stage ---
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY src/Zava.Api/Zava.Api.csproj ./Zava.Api/
RUN dotnet restore Zava.Api/Zava.Api.csproj

COPY src/Zava.Api/ ./Zava.Api/
RUN dotnet publish Zava.Api/Zava.Api.csproj -c Release -o /app/publish

# --- Runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "Zava.Api.dll"]
