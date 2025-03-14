export interface ProfilePageProps {
  params: { 
    userId: string 
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add any other user properties as needed
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  userId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  user?: User;
  // Add any other item properties as needed
}

export interface FollowData {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

export interface UserHeaderProps {
  user: User;
  followData: FollowData | null;
  ownedItemsCount: number;
  currentUserId: string;
}

export interface ListingsTabProps {
  items: Item[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  isLoading: boolean;
}

export interface AboutTabProps {
  user: User;
}

export interface ReviewsTabProps {
  userId: string;
}

export interface ProfileData {
  userQuery: {
    data: User | null;
    isLoading: boolean;
    error: any;
  };
  followDataQuery: {
    data: FollowData | null;
    isLoading: boolean;
    error: any;
  };
  ownedItemsQuery: {
    data: Item[] | null;
    isLoading: boolean;
    error: any;
  };
  isLoading: boolean;
  isFetching: boolean;
}
