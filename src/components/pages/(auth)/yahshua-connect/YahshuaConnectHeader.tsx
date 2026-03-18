'use client';

import { useState, useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCookie, deleteCookie } from 'cookies-next';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import { TOKEN_EXPIRATION_WARNING_SECONDS } from '@/lib/session';
import CustomToast from '@/components/CustomToast';
import useLogout from '@/components/hooks/useLogout';
import useRefreshToken from '@/components/hooks/useRefreshToken';
import SessionExpirationModal from '@/components/SessionExpirationModal';
import MessagesModal from '@/components/common/chat/MessagesModal';
import NotificationsModal from './modals/NotificationsModal';
import ChatModal from '@/components/common/chat/ChatModal';
import LocationPermissionModal from './modals/LocationPermissionModal';
import { useApplicantChatsList } from '../../../hooks/chat/yahshua-connect/useApplicantChatsList';
import { useGetEmployerApplicantChatsList } from '@/components/hooks/chat/employer/useGetEmployerApplicantChatsList';
import useGetApplicantProfile from './hooks/useGetApplicantProfile';
import useUpdateApplicantProfile from './profile/hooks/useUpdateApplicantProfile';
import useGetApplicantNotifications from './hooks/useGetApplicantNotifications';

import classNames from '@/helpers/classNames';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import YahshuaConnectLogo from '@/svg/YahshuaConnectLogo';
import NotificationsIcon from '@/svg/NotificationsIcon';
import ProfileDropdownIcon from '@/svg/ProfileDropdownIcon';
import ChatIcon from '@/svg/ChatIcon';
import ExitIcon from '@/svg/ExitIcon';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';

interface YahshuaConnectHeaderProps {
  disabled?: boolean;
  hasProfile: boolean;
  initialTokenExpiresAt?: number;
}

const YahshuaConnectHeader = ({ disabled = false, hasProfile, initialTokenExpiresAt }: YahshuaConnectHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{ id?: number; name: string; initials: string; photo?: string | null; jobId?: number; jobTitle?: string } | null>(null);
  const [showEmployerChatModal, setShowEmployerChatModal] = useState(false);
  const [selectedEmployerChat, setSelectedEmployerChat] = useState<{ appliedJobId: number; jobTitle: string; employerName: string; employerLogo?: string | null; employerInitials: string } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hasCheckedLocation, setHasCheckedLocation] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Get applicant profile to check for location data
  const { data: applicantDetails, isLoading: isProfileLoading } = useGetApplicantProfile();
  const profileData = applicantDetails?.data || applicantDetails;
  const { mutate: updateProfile } = useUpdateApplicantProfile();

  // Fetch personal chats (applicant-to-employer) to get unread count
  const { data: employerChatsData } = useGetEmployerApplicantChatsList(undefined, true);
  const personalUnreadCount = employerChatsData?.records.reduce((sum: number, chat: { unread_count?: number }) => sum + (chat.unread_count || 0), 0) || 0;

  // Fetch business chats (applicant-to-applicant marketplace) to get unread count
  const { data: businessChatsData } = useApplicantChatsList(undefined, true);
  const businessUnreadCount = businessChatsData?.records.reduce((sum: number, chat: { unread_count?: number }) => sum + (chat.unread_count || 0), 0) || 0;

  // Total unread count (personal + business)
  const totalUnreadCount = personalUnreadCount + businessUnreadCount;
  // Applicant notifications (YAHSHUA Connect)
  const { data: applicantNotificationsData } = useGetApplicantNotifications();
  const applicantUnreadCount = (() => {
    const pages = applicantNotificationsData?.pages || [];
    for (const p of pages) {
      if (p?.unread_count != null) return p.unread_count;
      if (p?.data?.unread_count != null) return p.data.unread_count;
      if (p?.data?.data?.unread_count != null) return p.data.data.unread_count;
    }
    return 0;
  })();
  const unreadCount = applicantUnreadCount;
  const [isExpiring, setIsExpiring] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { mutate } = useLogout();
  const { mutate: refreshToken } = useRefreshToken();
  
  // Determine active mode from pathname
  const activeMode = pathname?.includes('business-mode') ? 'business' : 'personal';
  
  // Check token on mount
  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      logout(true);
    }
  }, []);

  // Check if applicant has location data, show modal if not
  useEffect(() => {
    // Don't check if already checked, still loading, or disabled
    if (hasCheckedLocation || isProfileLoading || disabled) return;

    // Wait for profile data to be available
    if (!profileData) return;

    // Wait for hasProfile to be determined (don't proceed if false)
    if (!hasProfile) return;

    // Check if profile has valid latitude and longitude (non-zero values)
    const hasValidLocation =
      profileData?.latitude !== null &&
      profileData?.latitude !== undefined &&
      profileData?.latitude !== 0 &&
      profileData?.longitude !== null &&
      profileData?.longitude !== undefined &&
      profileData?.longitude !== 0;

    if (!hasValidLocation) {
      // Show location permission modal after a short delay to not overwhelm user
      const timer = setTimeout(() => {
        setShowLocationModal(true);
        setHasCheckedLocation(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // User already has valid location
      setHasCheckedLocation(true);
    }
  }, [profileData, isProfileLoading, hasCheckedLocation, hasProfile, disabled]);

  // Handle location obtained from permission modal
  const handleLocationObtained = (latitude: number, longitude: number) => {
    // Round to 6 decimal places to stay within backend's 9-digit total limit
    // 6 decimal places gives ~0.1 meter precision which is sufficient
    const roundedLatitude = Math.round(latitude * 1000000) / 1000000;
    const roundedLongitude = Math.round(longitude * 1000000) / 1000000;

    updateProfile(
      { latitude: roundedLatitude, longitude: roundedLongitude },
      {
        onSuccess: () => {
          toast.custom(
            () => <CustomToast message="Location saved successfully." type="success" />,
            { duration: 3000 }
          );
        },
        onError: () => {
          toast.custom(
            () => <CustomToast message="Failed to save location. Please try again." type="error" />,
            { duration: 4000 }
          );
        },
      }
    );
  };

  // Initialize token expiration from prop
  useEffect(() => {
    if (initialTokenExpiresAt && !tokenExpiresAt) {
      setTokenExpiresAt(initialTokenExpiresAt);
    }
  }, [initialTokenExpiresAt]);

  // Check token expiration every second
  useEffect(() => {
    if (!tokenExpiresAt) return;
    if (isRefreshing) return;

    const checkExpiration = () => {
      if (isRefreshing) return;
      
      const now = Date.now();
      const expiresAt = tokenExpiresAt;
      const remaining = Math.floor((expiresAt - now) / 1000);

      if (remaining <= 0) {
        if (!isRefreshing) {
          setIsExpiring(false);
          setTokenExpiresAt(undefined); // Clear expiration to stop checking
          // Timer reached 0 - session token has expired, logout immediately
          logout(true);
        }
        return;
      }

      // Show warning before expiration (30 seconds for 3-hour tokens)
      if (remaining <= TOKEN_EXPIRATION_WARNING_SECONDS) {
        setIsExpiring(true);
        setTimeRemaining(remaining);
      } else {
        setIsExpiring(false);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [tokenExpiresAt, router, isRefreshing, isExpiring, deleteCookie, mutate]);

  const handleRenewSession = () => {
    setIsRefreshing(true);
    setIsExpiring(false);
    
    refreshToken(undefined, {
      onSuccess: (data: any) => {
        if (data?.expires_at) {
          setTokenExpiresAt(data.expires_at);
        }
        // Refresh the browser to update all session data
        window.location.reload();
      },
      onError: (error: any) => {
        // Refresh failed, redirect to login
        router.push('/login');
      },
      onSettled: () => {
        setIsRefreshing(false);
      },
    });
  };

  const handleLogoutFromModal = () => {
    setIsLoggingOut(true);
    mutate(void 0, {
      onSuccess: () => {
        // Clear token cookie on client side as well (backup)
        deleteCookie('token');
        router.push('/login');
      },
      onError: (err: any) => {
        // Clear token cookie even on error
        deleteCookie('token');
        router.push('/login');
      },
      onSettled: () => {
        setIsLoggingOut(false);
      },
    });
  };
  
  const handleModeChange = (mode: 'personal' | 'business') => {
    if (disabled) return;
    const targetPath = mode === 'personal' 
      ? '/personal-mode' 
      : '/business-mode';
    router.push(targetPath);
  };

  const logout = (isExpired: boolean) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        if (isExpired) {
          toast.custom(() => <CustomToast message={'Session is expired.'} type='error' />, {
            duration: 4000,
          });
        } else {
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        }
        deleteCookie('token');
        location.href = '/login';
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err || 'Session is expired.'} type='error' />, {
          duration: 4000,
        });
        location.href = '/login';
      },
    };
    mutate(void 0, callbackReq);
  };

  // removed dummy notifications - NotificationsModal now fetches backend data directly

  // Personal Mode: Applicant to Employer chats (job applications)
  const handleSelectPersonalMessage = (chat: { appliedJobId: number; jobTitle: string; employerName: string; employerLogo?: string | null; employerInitials: string }) => {
    setSelectedEmployerChat(chat);
    setShowEmployerChatModal(true);
  };

  // Business Mode: Applicant to Applicant chats (marketplace)
  const handleSelectBusinessMessage = (chat: { id: number; name: string; initials: string; recipientId: number; photo?: string | null; jobId?: number; jobTitle?: string }) => {
    setSelectedChat({
      id: chat.recipientId,
      name: chat.name,
      initials: chat.initials,
      photo: chat.photo,
      jobId: chat.jobId,
      jobTitle: chat.jobTitle,
    });
    setShowChatModal(true);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop and Tablet Layout */}
        <div className="hidden md:flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {disabled ? (
              <div className="cursor-not-allowed opacity-50">
                <YahshuaConnectLogo />
              </div>
            ) : (
              <Link href="/personal-mode">
                <YahshuaConnectLogo />
              </Link>
            )}
          </div>

          <div className="flex-1" />

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className={classNames("flex items-center bg-gray-100 rounded-xl p-1", disabled && "opacity-50")}>
              <button
                onClick={() => handleModeChange('personal')}
                disabled={disabled}
                className={classNames(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeMode === 'personal'
                    ? 'bg-white text-indigo-dye shadow-sm'
                    : 'text-gray-600',
                  disabled && 'cursor-not-allowed'
                )}
              >
                Personal
              </button>
              <button
                disabled
                data-tooltip-id="business-mode-tooltip"
                data-tooltip-content="Coming Soon"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-gray-400 cursor-not-allowed opacity-50"
              >
                Business
              </button>
            </div>

            {/* Messages Button */}
            <button
              onClick={() => !disabled && setShowMessagesModal(true)}
              disabled={disabled}
              className={classNames(
                "relative p-2.5 text-gray-600 rounded-xl transition-colors",
                disabled 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-gray-100"
              )}
            >
              <ChatIcon />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5">
                  {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </span>
              )}
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => !disabled && setShowNotificationsModal(true)}
              disabled={disabled}
              className={classNames(
                "relative p-2.5 text-gray-600 rounded-xl transition-colors",
                disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              )}
            >
              <NotificationsIcon fill="#6B7280" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="relative p-2 rounded-xl transition-colors hover:bg-gray-100"
              >
                <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden">
                  {profileData?.photo ? (
                    <img 
                      src={profileData.photo} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PlaceholderAvatar
                      width={36}
                      height={36}
                      className="rounded-full"
                      firstName={profileData?.firstname || ''}
                      lastName={profileData?.lastname || ''}
                    />
                  )}
                </div>
                <div className="absolute bottom-0 right-0">
                  <ProfileDropdownIcon fill="#2C3F58" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* Profile Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {profileData?.firstname} {profileData?.lastname}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {profileData?.email}
                      </p>
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        logout(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <ExitIcon className="h-4 w-4 fill-red-600" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top Row - Logo and Icons */}
          <div className="flex items-center justify-between h-14 gap-2">
            {/* Logo */}
            <div className="flex-shrink-0 scale-75 origin-left">
              {disabled ? (
                <div className="cursor-not-allowed opacity-50">
                  <YahshuaConnectLogo />
                </div>
              ) : (
                <Link href="/personal-mode">
                  <YahshuaConnectLogo />
                </Link>
              )}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-1">
              {/* Messages */}
              <button
                onClick={() => !disabled && setShowMessagesModal(true)}
                disabled={disabled}
                className={classNames(
                  "relative p-2.5 text-gray-600 rounded-xl transition-colors",
                  disabled 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-gray-100"
                )}
              >
                <ChatIcon />
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Button (mobile) */}
              <button
                onClick={() => !disabled && setShowNotificationsModal(true)}
                disabled={disabled}
                className={classNames(
                  "relative p-2.5 text-gray-600 rounded-xl transition-colors",
                  disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                )}
              >
                <NotificationsIcon fill="#6B7280" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="relative p-2 rounded-xl transition-colors hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                    {profileData?.photo ? (
                      <img 
                        src={profileData.photo} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PlaceholderAvatar
                        width={32}
                        height={32}
                        className="rounded-full"
                        firstName={profileData?.firstname || ''}
                        lastName={profileData?.lastname || ''}
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <ProfileDropdownIcon fill="#2C3F58" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {/* Profile Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {profileData?.firstname} {profileData?.lastname}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {profileData?.email}
                        </p>
                      </div>
                      
                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          logout(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <ExitIcon className="h-4 w-4 fill-red-600" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Middle Row - Mode Toggle Buttons */}
          <div className="pb-2">
            <div className={classNames("flex items-center justify-center gap-2 bg-gray-100 rounded-xl p-1", disabled && "opacity-50")}>
              <button
                onClick={() => handleModeChange('personal')}
                disabled={disabled}
                className={classNames(
                  'flex-1 px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeMode === 'personal'
                    ? 'bg-white text-indigo-dye shadow-sm'
                    : 'text-gray-600',
                  disabled && 'cursor-not-allowed'
                )}
              >
                Personal
              </button>
              <button
                disabled
                data-tooltip-id="business-mode-tooltip"
                data-tooltip-content="Coming Soon"
                className="flex-1 px-4 py-1.5 rounded-lg text-xs font-medium transition-all text-gray-400 cursor-not-allowed opacity-50"
              >
                Business
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <MessagesModal
        isOpen={showMessagesModal}
        onClose={() => setShowMessagesModal(false)}
        role="applicant"
        onSelectPersonalMessage={handleSelectPersonalMessage}
        onSelectBusinessMessage={handleSelectBusinessMessage}
      />

      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />

      {selectedChat && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setSelectedChat(null);
          }}
          onBack={() => {
            setShowChatModal(false);
            setSelectedChat(null);
            setShowMessagesModal(true);
          }}
          chatType="applicant-applicant"
          recipientId={selectedChat.id}
          personName={selectedChat.name}
          personInitials={selectedChat.initials}
          personPhoto={selectedChat.photo}
          jobPostingId={selectedChat.jobId}
          subtitle={selectedChat.jobTitle}
        />
      )}

      {selectedEmployerChat && (
        <ChatModal
          isOpen={showEmployerChatModal}
          onClose={() => {
            setShowEmployerChatModal(false);
            setSelectedEmployerChat(null);
          }}
          onBack={() => {
            setShowEmployerChatModal(false);
            setSelectedEmployerChat(null);
            setShowMessagesModal(true);
          }}
          chatType="employer-applicant"
          appliedJobId={selectedEmployerChat.appliedJobId}
          subtitle={selectedEmployerChat.jobTitle}
          personName={selectedEmployerChat.employerName}
          personPhoto={selectedEmployerChat.employerLogo}
          personInitials={selectedEmployerChat.employerInitials}
        />
      )}

      {/* Session Expiration Modal */}
      <SessionExpirationModal
        isOpen={isExpiring}
        onRenew={handleRenewSession}
        onLogout={handleLogoutFromModal}
        timeRemaining={timeRemaining}
        isRefreshing={isRefreshing}
        isLoggingOut={isLoggingOut}
      />

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationObtained={handleLocationObtained}
      />

      <Tooltip id="business-mode-tooltip" />
    </header>
  );
};

export default YahshuaConnectHeader;

