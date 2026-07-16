---
title: Deploying .NET Apps on Azure — A Practical Guide
excerpt: A step-by-step guide to deploying .NET Core applications to Azure — from CI/CD pipelines to monitoring and scaling.
tag: Cloud & DevOps
date: 2026-07-10
readTime: 7 min read
---

## Picking the right Azure service

For most business web apps, **Azure App Service** is the right starting point — not Azure Kubernetes Service, not Azure Functions. App Service handles scaling, SSL, and deployment slots without you managing infrastructure.

## Setting up CI/CD with GitHub Actions

Connect your GitHub repo directly in the Azure Portal under Deployment Center. Azure generates a workflow file for you — but it's worth reading through it rather than trusting it blindly, especially the build step targeting the correct .NET version.

## Environment variables, not appsettings.json

Never commit secrets to `appsettings.json`. Azure App Service has a Configuration blade for environment variables that map directly to `IConfiguration` in your app — the same pattern works whether you're on Azure or a simpler host like Render.

## Monitoring after launch

Application Insights is bundled free at low volume and gives you real error tracking and performance data — turn it on before you need it, not after your first outage.