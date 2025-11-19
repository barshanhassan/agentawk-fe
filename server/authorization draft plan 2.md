CREATE TABLE users (
    id VARCHAR(191) PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(255),
    
    status ENUM('ACTIVE', 'INVITED', 'INACTIVE') DEFAULT 'ACTIVE',
    
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

<!-- This should be a cache entry instead? -->
<!-- CREATE TABLE sessions (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    refresh_token VARCHAR(512) NOT NULL UNIQUE,
    user_agent VARCHAR(255),
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); -->

CREATE TABLE tenants (
    id VARCHAR(191) PRIMARY KEY,
    organizationName VARCHAR(191) NOT NULL,
    
    owner_id VARCHAR(191) NOT NULL UNIQUE, 
    
    meta_business_id VARCHAR(191),
    waba_id VARCHAR(191),
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    plan ENUM('TRIAL', 'STARTER', 'GROWTH', 'ENTERPRISE') DEFAULT 'TRIAL',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE tenant_members (
    id VARCHAR(191) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    user_id VARCHAR(191) NOT NULL,
    
    -- YOUR SPECIFIC ROLE LIST
    -- This role applies to the user EVERYWHERE in the app
    role ENUM(
        'ADMINISTRATOR', 
        'AGENT', 
        'CHATBOT_USER', 
        'MARKETER', 
        'TEAM_SUPERVISOR', 
        'VIEWER', 
        'WABA_MANAGER'
    ) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_tenant_user (tenant_id, user_id)
);

CREATE TABLE workspaces (
    id VARCHAR(191) PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    tenant_id VARCHAR(191) NOT NULL,
    
    whatsapp_phone_number_id VARCHAR(191),
    whatsapp_display_phone VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE workspace_members (
    id VARCHAR(191) PRIMARY KEY,
    workspace_id VARCHAR(191) NOT NULL,
    user_id VARCHAR(191) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_workspace_user (workspace_id, user_id)
);

CREATE TABLE teams (
    id VARCHAR(191) PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    workspace_id VARCHAR(191) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE TABLE team_members (
    id VARCHAR(191) PRIMARY KEY,
    team_id VARCHAR(191) NOT NULL,
    workspace_member_id VARCHAR(191) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (workspace_member_id) REFERENCES workspace_members(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_team_member (team_id, workspace_member_id)
);