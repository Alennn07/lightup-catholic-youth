# Youth Groups Role-Based Enhancement System

## 🎯 Overview

This document outlines the comprehensive role-based enhancement system implemented for the LightUp Catholic Youth Groups feature. The system provides granular permission control, approval workflows, and real-time notifications while maintaining backward compatibility with existing functionality.

## 🏗️ System Architecture

### Database Schema Enhancements

#### 1. Users Table Enhancements
```sql
-- Added role-based columns to users table
ALTER TABLE users 
ADD COLUMN user_role VARCHAR(50) DEFAULT 'member',
ADD COLUMN can_create_groups BOOLEAN DEFAULT false,
ADD COLUMN is_group_leader BOOLEAN DEFAULT false;
```

#### 2. Youth Groups Table Enhancements
```sql
-- Enhanced youth_groups table with ownership and approval settings
ALTER TABLE youth_groups 
ADD COLUMN owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN requires_approval BOOLEAN DEFAULT true,
ADD COLUMN max_members INTEGER DEFAULT 50,
ADD COLUMN is_public BOOLEAN DEFAULT true;
```

#### 3. New Tables

**group_join_requests**
- Manages join request workflow
- Tracks approval status and review messages
- Links to group and user

**group_notifications**
- Real-time notifications for group activities
- Supports different notification types
- Tracks read/unread status

**Enhanced youth_group_members**
- Added status tracking (active, pending, suspended)
- Granular permissions for different actions
- Invitation tracking

### Role Hierarchy

1. **Admin** - Full system access
2. **Group Leader** - Can create groups, manage multiple groups
3. **Group Owner** - Full control over their specific group
4. **Group Member** - Limited permissions within groups
5. **Member** - Basic user with limited group access

## 🔧 API Endpoints

### Core Group Management
- `GET /api/youth-groups` - List groups with role-based filtering
- `POST /api/youth-groups` - Create group (requires group leader role)
- `PUT /api/youth-groups/[id]` - Update group (owner only)
- `DELETE /api/youth-groups/[id]` - Delete group (owner only)

### Join Request Workflow
- `POST /api/youth-groups/[id]/join-request` - Submit join request
- `GET /api/youth-groups/[id]/join-request` - Get pending requests (owner only)
- `PUT /api/youth-groups/[id]/requests/[requestId]` - Approve/reject requests

### Member Management
- `POST /api/youth-groups/[id]/members` - Add member directly (owner only)
- `GET /api/youth-groups/[id]/members` - List group members
- `DELETE /api/youth-groups/[id]/members/[memberId]` - Remove member

### Permissions & Notifications
- `GET /api/users/permissions` - Get user permissions
- `GET /api/youth-groups/[id]/permissions` - Get group-specific permissions
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/[id]/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

## 🎨 Frontend Components

### Core Components

#### 1. Enhanced Youth Groups Component
- **File**: `components/enhanced-youth-groups.tsx`
- **Features**:
  - Role-based UI rendering
  - Join request workflow
  - Member management interface
  - Real-time notifications

#### 2. Role-Based Wrapper Components
- **File**: `components/role-based-wrapper.tsx`
- **Components**:
  - `RoleBasedWrapper` - Generic permission wrapper
  - `AdminOnly` - Admin-only content
  - `GroupLeaderOnly` - Group leader content
  - `GroupOwnerOnly` - Group owner content
  - `CanCreateGroups` - Group creation permission
  - `CanManageMembers` - Member management permission

#### 3. Member Request Modal
- **File**: `components/member-request-modal.tsx`
- **Features**:
  - Display pending join requests
  - Approve/reject functionality
  - Review message system
  - Real-time updates

#### 4. Notification System
- **File**: `components/notification-badge.tsx`
- **Features**:
  - Unread count display
  - Notification dropdown
  - Real-time updates
  - Mark as read functionality

### Hooks

#### 1. usePermissions Hook
- **File**: `hooks/use-permissions.ts`
- **Features**:
  - User permission management
  - Group-specific permissions
  - Permission checking utilities
  - Real-time permission updates

## 🔐 Security Features

### Row Level Security (RLS) Policies

#### Youth Groups
- Users can view public groups
- Group owners can view/manage their groups
- Group members can view their groups
- Only group leaders can create groups

#### Group Members
- Users can view members of public groups
- Group owners can manage all members
- Users can join public groups
- Members can leave groups (except owners)

#### Join Requests
- Users can create their own requests
- Users can view their own requests
- Group owners can view/manage group requests

#### Notifications
- Users can only view their own notifications
- Users can only update their own notifications

### Permission Validation

All API endpoints validate permissions at multiple levels:
1. **Authentication** - Valid JWT token required
2. **Authorization** - Role-based permission checks
3. **Resource Ownership** - Ownership validation for sensitive operations
4. **Database Level** - RLS policies enforce security

## 🚀 Key Features

### 1. Role-Based Group Creation
- Only users with `can_create_groups` permission can create groups
- Group creators automatically become group owners
- Automatic role assignment based on permissions

### 2. Approval Workflow
- Groups can require approval for new members
- Join requests are tracked and managed
- Group owners can approve/reject requests
- Automatic notifications for all parties

### 3. Granular Permissions
- **Group Creation**: Controlled by user role
- **Member Management**: Owner and designated managers
- **Event Creation**: Owner and designated members
- **Post Creation**: Owner and designated members
- **Content Management**: Role-based access control

### 4. Real-Time Notifications
- Join request notifications
- Approval/rejection notifications
- Member activity notifications
- Group event notifications

### 5. Member Management
- Direct member addition by owners
- Bulk member management
- Member role assignment
- Permission delegation

## 📱 User Experience

### For Group Leaders
- Clear permission indicators
- Streamlined group creation process
- Comprehensive member management tools
- Real-time notification system

### For Group Members
- Intuitive join process
- Clear status indicators
- Permission-based feature access
- Notification management

### For Regular Users
- Discoverable public groups
- Simple join request process
- Clear permission boundaries
- Helpful error messages

## 🔄 Migration Strategy

### Phase 1: Database Enhancement
1. Run `scripts/enhance-youth-groups-role-system.sql`
2. Update existing data with default values
3. Set up RLS policies

### Phase 2: API Enhancement
1. Deploy new API endpoints
2. Update existing endpoints with permission checks
3. Test all endpoints thoroughly

### Phase 3: Frontend Integration
1. Deploy new components
2. Update existing components
3. Test user workflows

### Phase 4: Rollout
1. Gradual feature enablement
2. User training and documentation
3. Monitor and optimize

## 🧪 Testing Checklist

### Database Tests
- [ ] RLS policies work correctly
- [ ] Triggers update data properly
- [ ] Functions return correct values
- [ ] Indexes improve performance

### API Tests
- [ ] Permission validation works
- [ ] Join request workflow functions
- [ ] Member management operations
- [ ] Notification system works

### Frontend Tests
- [ ] Role-based UI rendering
- [ ] Permission checks work
- [ ] User workflows complete
- [ ] Error handling works

### Integration Tests
- [ ] End-to-end user flows
- [ ] Cross-component communication
- [ ] Real-time updates work
- [ ] Performance is acceptable

## 🚨 Rollback Plan

If issues arise:

1. **Disable RLS policies** - Allow all operations temporarily
2. **Hide new UI elements** - Use feature flags to disable new features
3. **Revert to direct join** - Bypass approval workflow
4. **Remove permission checks** - Allow all users to perform all actions

## 📊 Monitoring & Analytics

### Key Metrics
- Group creation rate by role
- Join request approval rate
- Member engagement by permission level
- Notification interaction rates

### Performance Monitoring
- API response times
- Database query performance
- Real-time update latency
- User experience metrics

## 🔮 Future Enhancements

### Planned Features
- Custom role definitions
- Cross-parish group management
- Automated group suggestions
- Advanced analytics dashboard
- Mobile app integration

### Scalability Considerations
- Database partitioning for large datasets
- Caching strategies for permissions
- Real-time update optimization
- API rate limiting

## 📚 Documentation

### For Developers
- API documentation with examples
- Component usage guidelines
- Permission system architecture
- Testing procedures

### For Users
- Role-based feature guide
- Group management tutorial
- Permission explanation
- Troubleshooting guide

## 🤝 Support

### Technical Support
- Database issues: Check RLS policies and permissions
- API issues: Verify authentication and authorization
- Frontend issues: Check permission hooks and components

### User Support
- Permission questions: Explain role hierarchy
- Feature access: Guide through permission requirements
- Workflow issues: Provide step-by-step instructions

---

This role-based enhancement system provides a robust, secure, and user-friendly foundation for managing Catholic youth groups while maintaining the flexibility to grow and adapt to future needs.
