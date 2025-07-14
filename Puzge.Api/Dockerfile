FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Expose app ports and debugger port
EXPOSE 8080
EXPOSE 8081
EXPOSE 5005

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /src
COPY . .
RUN dotnet restore "Puzge.Api.csproj"
RUN dotnet build "Puzge.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Debug
RUN dotnet publish "Puzge.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Start app with debug enabled and wait for debugger on port 5005
ENTRYPOINT ["dotnet", "Puzge.Api.dll", "--server.urls", "http://0.0.0.0:8080", "--additional-deps", "Microsoft.VisualStudio.Web.CodeGeneration.Design"]