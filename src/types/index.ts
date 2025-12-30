// User and Authentication Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'worker';
    avatar?: string;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    role: 'admin' | 'worker';
}

// Child and Wishlist Types
export interface Child {
    id: string;
    name: string;
    age: number;
    location: string;
    category: 'nice' | 'naughty';
    wishlistId?: string;
    createdAt: string;
}

export interface WishlistItem {
    id: string;
    giftName: string;
    description?: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'approved' | 'rejected';
}

export interface Wishlist {
    id: string;
    childId: string;
    items: WishlistItem[];
    createdAt: string;
    updatedAt: string;
}

// Task Types
export interface Task {
    id: string;
    title: string;
    description: string;
    giftType: string;
    quantity: number;
    assignedTo?: string;
    assignedToName?: string;
    status: 'pending' | 'in_progress' | 'completed';
    assignee?: User;
    progress?: number;
    notes?: string;
    priority: 'high' | 'medium' | 'low';
    deadline: string;
    createdAt: string;
    updatedAt: string;
}

// Delivery Types
export interface Delivery {
    id: string;
    childId?: string;
    child?: Child;
    childName?: string;
    region: string;
    country?: string;
    address?: string;
    giftItems?: string[];
    status: 'pending' | 'in_transit' | 'delivered';
    deliveryDate?: string;
    totalPackages?: number;
    deliveredPackages?: number;
    estimatedArrival?: string;
    assignedTo?: string;
    createdAt: string;
    updatedAt?: string;
}

// Dashboard Statistics
export interface DashboardStats {
    totalChildren: number;
    totalGifts: number;
    pendingTasks: number;
    completedTasks: number;
    pendingDeliveries: number;
    completedDeliveries: number;
    niceChildren: number;
    naughtyChildren: number;
}

// Worker Statistics
export interface WorkerStats {
    assignedTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    productivity: number;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Worker Type
export interface Worker {
    id: string;
    name: string;
    email: string;
    role: string;
}

// Activity Type
export interface Activity {
    id: string;
    message: string;
    time: string;
    icon: string;
    type: string;
}
