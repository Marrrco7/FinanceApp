FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY FinanceApp.sln ./
COPY FinanceApp.Api/FinanceApp.Api.csproj FinanceApp.Api/
COPY FinanceApp.Application/FinanceApp.Application.csproj FinanceApp.Application/
COPY FinanceApp.Domain/FinanceApp.Domain.csproj FinanceApp.Domain/
COPY FinanceApp.Infrastructure/FinanceApp.Infrastructure.csproj FinanceApp.Infrastructure/
COPY FinanceApp.Tests/FinanceApp.Tests.csproj FinanceApp.Tests/

RUN dotnet restore

COPY . ./
RUN dotnet publish FinanceApp.Api/FinanceApp.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet", "FinanceApp.Api.dll"]
