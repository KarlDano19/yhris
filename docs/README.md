# Yahshua HRIS Frontend - Complete Documentation

## Overview

This documentation provides comprehensive coverage of the Yahshua HRIS (Human Resource Information System) frontend application. The system is built with Next.js 14 and serves as a complete HR management platform supporting multiple user roles.

## Documentation Structure

This documentation is organized into the following modules:

### Core Architecture
- [App Router Structure](./01-app-router.md) - Next.js 14 App Router implementation
- [Authentication & Sessions](./02-authentication.md) - Iron Session implementation and middleware
- [State Management](./03-state-management.md) - Zustand and TanStack Query setup

### Components & UI
- [Component Architecture](./04-components.md) - Reusable UI components
- [Page Components](./05-page-components.md) - Route-specific components
- [Hooks Documentation](./06-hooks.md) - Custom React hooks for API integration

### Business Logic
- [User Management](./07-user-management.md) - Multi-role user system
- [Job Management](./08-job-management.md) - Job posting and applicant screening
- [Employee Management](./09-employee-management.md) - Employee lifecycle management
- [Document Management](./10-document-management.md) - Document generation and handling

### Utilities & Configuration
- [Helper Functions](./11-helpers.md) - Utility functions and constants
- [Type Definitions](./12-types.md) - TypeScript type system
- [Configuration](./13-configuration.md) - Environment and build configuration

### Development & Deployment
- [Development Guide](./14-development.md) - Local development setup
- [Deployment Guide](./15-deployment.md) - Production deployment

## Quick Start

1. **Installation**: `npm install`
2. **Development**: `npm run dev`
3. **Build**: `npm run build`
4. **Production**: `npm start`

## Key Technologies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + TanStack Query
- **Authentication**: Iron Session
- **Forms**: React Hook Form
- **UI**: Headless UI + Hero Icons

## User Roles

- **Employers**: Complete HRIS functionality
- **Applicants**: Job search and application management
- **Administrators**: System administration and monitoring

## Architecture Principles

1. **Type Safety**: Comprehensive TypeScript usage
2. **Separation of Concerns**: Clear module boundaries
3. **Security First**: Robust authentication and authorization
4. **Performance**: Optimized data fetching and caching
5. **Scalability**: Modular architecture for growth

## Getting Help

For specific implementation details, refer to the individual module documentation files. Each file contains detailed explanations, code examples, and usage patterns.
