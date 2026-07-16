FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY PersonalInformation/*.csproj PersonalInformation/
RUN dotnet restore PersonalInformation/PersonalInformation.csproj

# Copy everything else and build
COPY PersonalInformation/ PersonalInformation/
WORKDIR /src/PersonalInformation
RUN dotnet publish -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 80
ENTRYPOINT ["dotnet", "PersonalInformation.dll"]