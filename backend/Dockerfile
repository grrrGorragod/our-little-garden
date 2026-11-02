
# ขั้นตอน Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY OurLittleGarden.Api.csproj ./
RUN dotnet restore OurLittleGarden.Api.csproj

COPY . ./
RUN dotnet publish OurLittleGarden.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ขั้นตอน Run
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish ./

ENV ASPNETCORE_HTTP_PORTS=10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "OurLittleGarden.Api.dll"]
