# 🛠️ Development Tools

This folder contains development and testing tools for the LightUp Catholic Youth website.

## 📁 Structure

```
dev/
├── test-panel/                    # Interactive testing components
│   ├── youth-groups-test-panel.tsx    # Main test panel component
│   └── test-youth-groups/             # Test page components
│       └── page.tsx
├── scripts/                       # Development database scripts
│   └── add-analytics-tables.sql      # Analytics tables setup
├── TESTING_GUIDE.md              # Comprehensive testing guide
└── README.md                     # This file
```

## 🚀 Usage

### Testing Youth Groups Features
- **URL:** `/dev/test-youth-groups` (development only)
- **Features:** Real-time updates, Notifications, Advanced Search, Analytics
- **Access:** Only available in development mode

### Database Setup
- Run `scripts/add-analytics-tables.sql` in Supabase for full analytics functionality
- Scripts are safe to run multiple times (uses IF NOT EXISTS)

## 🔒 Security

- All dev tools are **development-only**
- Production builds will show "Access Denied" for dev routes
- Test data is isolated and doesn't affect production

## 📝 Development Workflow

1. **Feature Development:** Use test panel to verify new features
2. **Database Changes:** Run scripts in Supabase development environment
3. **Testing:** Follow TESTING_GUIDE.md for comprehensive testing
4. **Cleanup:** Remove test data before production deployment

## 🎯 Best Practices

- Always test features in the dev panel before committing
- Use mock data for testing to avoid affecting real data
- Document any new test procedures in TESTING_GUIDE.md
- Keep dev tools up-to-date with production features
