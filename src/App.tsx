import { PublishDatasetsPage } from './PublishDatasetsPage';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { Stack, Text, Nav, PrimaryButton, DefaultButton, Dropdown, SearchBox, Spinner, SpinnerSize } from '@fluentui/react';

initializeIcons();

function getNavLinks(activeCleanroom?: any, currentPath?: string) {
  // Check for pending queries (filtered by active cleanroom)
  const storedQueries = localStorage.getItem('queries');
  const queries = storedQueries ? JSON.parse(storedQueries) : [];
  const pendingQueriesCount = queries.filter((q: any) => 
    q.status === 'pending' && (!activeCleanroom || q.cleanroomId === activeCleanroom.id)
  ).length;
  
  // Check for pending collaboration invitations
  const storedCleanrooms = localStorage.getItem('cleanrooms');
  const cleanrooms = storedCleanrooms ? JSON.parse(storedCleanrooms) : [];
  const loggedInUserEmail = localStorage.getItem('loggedInUserEmail') || 'amit@contoso.com';
  const pendingInvitationsCount = cleanrooms.filter((cr: any) => {
    const userMembership = cr.members.find((m: any) => m.email === loggedInUserEmail);
    return userMembership && userMembership.status === 'Invited';
  }).length;
  
  // If we're on collaborations selection page, only show collaborations tab
  if (!currentPath || currentPath === '/cleanrooms') {
    return [
      {
        key: 'collaborations',
        name: pendingInvitationsCount > 0 ? `Collaborations [${pendingInvitationsCount} Pending Acceptance]` : 'Collaborations',
        url: '/cleanrooms',
        icon: 'BulkUpload',
      }
    ];
  }
  
  // If we're on collaboration-specific pages, control navigation based on workload selection
  if (activeCleanroom && (currentPath === '/members' || currentPath === '/publish' || currentPath === '/queries' || currentPath === '/audit' || currentPath === '/summary')) {
    // Check if user has accepted membership and selected a workload
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail') || 'amit@contoso.com';
    const userMembership = activeCleanroom.members?.find((m: any) => m.email === loggedInUserEmail);
    const hasAcceptedMembership = userMembership?.status === 'Active';
    const selectedWorkload = localStorage.getItem(`selectedWorkload_${activeCleanroom.id}`);
    
    // If user hasn't accepted membership or hasn't selected workload, show only membership tab
    // This applies to Members page and redirects other pages to Members
    if (!hasAcceptedMembership || !selectedWorkload) {
      // If trying to access other pages without workload selection, redirect to members
      if (currentPath !== '/members') {
        window.location.href = '/members';
        return [];
      }
      
      return [
        {
          key: 'members',
          name: pendingInvitationsCount > 0 ? `Members [${pendingInvitationsCount} Pending]` : 'Members',
          url: '/members',
          icon: 'People',
        }
      ];
    }
    
    // If user has accepted and selected workload, show full navigation without Members tab
    return [
      {
        key: 'summary',
        name: 'Summary',
        url: '/summary',
        icon: 'BarChart4',
      },
      {
        key: 'datasets',
        name: 'Datasets',
        url: '/publish',
        icon: 'Database',
      },
      {
        key: 'queries',
        name: pendingQueriesCount > 0 ? `Queries [${pendingQueriesCount} Pending]` : 'Queries',
        url: '/queries',
        icon: 'Search',
      },
      {
        key: 'audit',
        name: 'Audit',
        url: '/audit',
        icon: 'ClipboardList',
      }
    ];
  }
  
  // Default fallback
  return [
    {
      key: 'collaborations',
      name: pendingInvitationsCount > 0 ? `Collaborations [${pendingInvitationsCount} Pending]` : 'Collaborations',
      url: '/cleanrooms',
      icon: 'BulkUpload',
    }
  ];
}

function SimulatedLoginPanel({ onSignIn }: { onSignIn: (email: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('amit@contoso.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const allowedUsers = ['amit@contoso.com', 'ram@fabrikam.com'];

  const handleSignIn = () => {
    if (!allowedUsers.includes(email.toLowerCase())) {
      setError('Invalid user. Only amit@contoso.com and ram@fabrikam.com are allowed.');
      return;
    }
    setError('');
    if (email.trim() && email.includes('@') && password.trim()) {
      setLoading(true); 
      setTimeout(() => onSignIn(email.toLowerCase()), 1200); 
    }
  };
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 50%, #005a9e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, system-ui, sans-serif'
    }}>
      {/* Background pattern overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm0-20c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.1
      }} />
      
      {/* Main sign-in card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        padding: '48px 40px',
        width: '440px',
        maxWidth: '90vw',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Microsoft Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            margin: '0 auto 16px',
            background: 'linear-gradient(45deg, #f35325 25%, #81bc06 25%, #81bc06 50%, #05a6f0 50%, #05a6f0 75%, #ffba08 75%)',
            display: 'grid',
            gridTemplate: '1fr 1fr / 1fr 1fr',
            gap: '1px'
          }}>
            <div style={{ background: '#f35325' }}></div>
            <div style={{ background: '#81bc06' }}></div>
            <div style={{ background: '#05a6f0' }}></div>
            <div style={{ background: '#ffba08' }}></div>
          </div>
          <div style={{ 
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            fontWeight: 600, 
            color: '#323130', 
            fontSize: '24px',
            marginBottom: '8px'
          }}>
            Microsoft
          </div>
        </div>

        {/* Sign-in content */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            fontWeight: 600, 
            color: '#323130', 
            fontSize: '28px',
            marginBottom: '8px',
            lineHeight: '36px',
            margin: '0 0 8px 0',
            textAlign: 'left'
          }}>
            Sign in
          </h1>
          <div style={{ 
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            color: '#605e5c',
            fontSize: '15px',
            lineHeight: '20px',
            textAlign: 'left'
          }}>
            Use your Microsoft Work/School or Azure account to sign into Azure Confidential Clean Rooms
          </div>
        </div>

        {/* Email input */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="amit@contoso.com or ram@fabrikam.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #605e5c',
              borderRadius: '4px',
              fontSize: '15px',
              fontFamily: 'Segoe UI, system-ui, sans-serif',
              background: '#ffffff',
              color: '#323130',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0078d4';
              e.target.style.boxShadow = '0 0 0 1px #0078d4';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#605e5c';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Password input */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #605e5c',
              borderRadius: '4px',
              fontSize: '15px',
              fontFamily: 'Segoe UI, system-ui, sans-serif',
              background: '#ffffff',
              color: '#323130',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0078d4';
              e.target.style.boxShadow = '0 0 0 1px #0078d4';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#605e5c';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#fef6f6',
            border: '1px solid #d13438',
            borderRadius: '4px',
            color: '#d13438',
            fontSize: '14px',
            fontFamily: 'Segoe UI, system-ui, sans-serif'
          }}>
            {error}
          </div>
        )}

        {/* Sign-in button */}
        <PrimaryButton 
          style={{ 
            width: '100%',
            height: '48px',
            background: (!email.trim() || !email.includes('@') || !password.trim()) ? '#a19f9d' : '#0078d4',
            border: 'none',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 600,
            marginBottom: '32px',
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            cursor: (!email.trim() || !email.includes('@') || !password.trim() || loading) ? 'not-allowed' : 'pointer'
          }} 
          onClick={handleSignIn}
          disabled={!email.trim() || !email.includes('@') || !password.trim() || loading}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Signing in...
            </div>
          ) : 'Sign in'}
        </PrimaryButton>

        {/* Forgot password link */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <a href="#" style={{ 
            color: '#0078d4', 
            fontSize: '13px', 
            textDecoration: 'none',
            fontFamily: 'Segoe UI, system-ui, sans-serif'
          }}>
            Forgot my password
          </a>
        </div>

        {/* Footer links */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #edebe9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#" style={{ 
              color: '#0078d4', 
              fontSize: '12px', 
              textDecoration: 'none',
              fontFamily: 'Segoe UI, system-ui, sans-serif'
            }}>Terms of use</a>
            <a href="#" style={{ 
              color: '#0078d4', 
              fontSize: '12px', 
              textDecoration: 'none',
              fontFamily: 'Segoe UI, system-ui, sans-serif'
            }}>Privacy & cookies</a>
            <a href="#" style={{ 
              color: '#0078d4', 
              fontSize: '12px', 
              textDecoration: 'none',
              fontFamily: 'Segoe UI, system-ui, sans-serif'
            }}>...</a>
          </div>
        </div>
      </div>

      {/* CSS animation for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function AppLayout({ children, userInfo, activeCleanroom }: { children: React.ReactNode, userInfo?: React.ReactNode, activeCleanroom?: any }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navLinks = getNavLinks(activeCleanroom, location.pathname);
  return (
    <Stack styles={{ root: { minHeight: '100vh', background: '#f3f2f1' } }}>
      {/* Top Header Bar */}
      {userInfo && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e1dfdd',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          {userInfo}
        </div>
      )}
      
      {/* Main Layout */}
      <Stack horizontal styles={{ root: { flex: 1 } }}>
        <Stack styles={{ root: { width: 280, background: '#f8f8f8', boxShadow: '1px 0 8px rgba(0,0,0,0.06)', borderRight: '1px solid #e1dfdd' } }}>
          <Text variant="xLarge" styles={{ root: { margin: '40px 0 32px 32px', fontWeight: 600, color: '#0078d4', letterSpacing: '0.5px' } }}>Azure Confidential Clean Rooms</Text>
          
          {/* Active Cleanroom Header for cleanroom-specific pages */}
          {activeCleanroom && (location.pathname === '/members' || location.pathname === '/publish' || location.pathname === '/queries' || location.pathname === '/audit' || location.pathname === '/summary') && (
            <div style={{
              margin: '0 32px 24px 32px',
              backgroundColor: '#ffffff',
              border: '1px solid #e1dfdd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              {/* Blue header */}
              <div style={{
                backgroundColor: '#0078d4',
                padding: '12px 20px',
                borderBottom: '1px solid #e1dfdd'
              }}>
                <Text style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#ffffff', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: 0
                }}>
                  ACTIVE COLLABORATION
                </Text>
              </div>
              
              {/* Content */}
              <div style={{ padding: '20px' }}>
                <Text style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#323130',
                  lineHeight: '22px',
                  marginBottom: '16px',
                  display: 'block'
                }}>
                  {(() => {
                    const selectedWorkload = localStorage.getItem(`selectedWorkload_${activeCleanroom.id}`);
                    const availableWorkloads = [
                      { id: 'analytics', name: 'Analytics' }
                    ];
                    const workloadName = availableWorkloads.find(w => w.id === selectedWorkload)?.name;
                    return workloadName ? `${activeCleanroom.name} [${workloadName}]` : activeCleanroom.name;
                  })()}
                </Text>
                
                <PrimaryButton
                  text="← Back to Collaborations"
                  onClick={() => navigate('/cleanrooms')}
                  styles={{
                    root: {
                      width: '100%',
                      height: '32px',
                      backgroundColor: '#f3f2f1',
                      border: '1px solid #e1dfdd',
                      color: '#323130'
                    },
                    rootHovered: {
                      backgroundColor: '#edebe9',
                      border: '1px solid #d2d0ce'
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          <Nav
            groups={[{ links: navLinks }]}
            selectedKey={navLinks.find(l => window.location.pathname.startsWith(l.url))?.key}
            onLinkClick={(_, item) => item && navigate(item.url)}
            styles={{ 
              root: { fontSize: 16 },
              link: {
                fontSize: '14px',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px'
              }
            }}
          />
        </Stack>
        <Stack styles={{ root: { flex: 1, padding: '48px 60px', maxWidth: 1400, minWidth: 700, margin: '0 auto', background: '#f3f2f1' } }}>
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
}

function CleanroomsPage({ cleanrooms, setActiveCleanroom, activeCleanroom, loggedInUser }: {
  cleanrooms: any[],
  setActiveCleanroom: (cleanroom: any) => void,
  activeCleanroom: any,
  loggedInUser: any
}) {
  const navigate = useNavigate();
  
  // Get cleanrooms where this user is a member
  const userCleanrooms = cleanrooms.filter(cr => 
    cr.members.some((m: any) => m.email === loggedInUser.email)
  );

  const handleSelectCleanroom = (cleanroom: any) => {
    setActiveCleanroom(cleanroom);
    // Navigate to members page immediately after setting the cleanroom
    navigate('/members');
  };

  return (
    <div style={{ 
      backgroundColor: '#faf9f8', 
      minHeight: '100vh', 
      padding: '64px 48px 64px 48px' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <div style={{ marginBottom: 64, paddingBottom: 32 }}>
          <Text variant="xxLarge" styles={{ 
            root: { 
              color: '#323130', 
              fontWeight: 600, 
              marginBottom: 20,
              fontSize: '36px',
              lineHeight: '44px',
              display: 'block'
            } 
          }}>
            My Collaborations
          </Text>
          <Text variant="large" styles={{ 
            root: { 
              color: '#605e5c',
              fontSize: '18px',
              lineHeight: '26px'
            } 
          }}>
            Select a collaboration to access datasets, queries, and collaboration tools
          </Text>
        </div>

        {userCleanrooms.length === 0 ? (
          <div style={{
            padding: '64px 32px',
            textAlign: 'center',
            border: '2px dashed #d1d1d1',
            borderRadius: 12,
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <Text variant="large" styles={{ root: { color: '#605e5c', marginBottom: 16 } }}>
              You're not part of any collaborations yet
            </Text>
            <Text variant="medium" styles={{ root: { color: '#8a8886' } }}>
              Contact your organization's administrator to get invited to a collaboration
            </Text>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: 24, 
            gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
            marginBottom: 24
          }}>
            {(() => {
              // Get or create stable order for cleanrooms
              const stableOrderKey = `cleanroom_order_${loggedInUser.email}`;
              let stableOrder = JSON.parse(localStorage.getItem(stableOrderKey) || '{}');
              
              // Add any new cleanrooms to the stable order
              userCleanrooms.forEach(cleanroom => {
                if (!stableOrder[cleanroom.id]) {
                  const userMembership = cleanroom.members.find((m: any) => m.email === loggedInUser.email);
                  const isPending = userMembership?.status === 'Invited';
                  // Assign order based on whether it's pending (lower numbers = higher priority)
                  stableOrder[cleanroom.id] = isPending ? Date.now() : Date.now() + 1000000000000;
                }
              });
              
              // Save updated stable order
              localStorage.setItem(stableOrderKey, JSON.stringify(stableOrder));
              
              // Sort cleanrooms by their stable order
              return userCleanrooms.sort((a, b) => stableOrder[a.id] - stableOrder[b.id]);
            })()
              .map(cleanroom => {
              const userMembership = cleanroom.members.find((m: any) => m.email === loggedInUser.email);
              const isOwner = userMembership?.role === 'Owner';
              const isActive = userMembership?.status === 'Active';
              const isPending = userMembership?.status === 'Invited';
              const isCurrentActive = activeCleanroom?.id === cleanroom.id;
              
              return (
                <div
                  key={cleanroom.id}
                  style={{
                    border: `2px solid ${isCurrentActive ? '#0078d4' : '#e1dfdd'}`,
                    borderRadius: 12,
                    padding: 32,
                    backgroundColor: isCurrentActive ? '#f8fcff' : '#ffffff',
                    boxShadow: isCurrentActive ? '0 4px 16px rgba(0,120,212,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s ease',
                    minHeight: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <Text variant="xLarge" styles={{ 
                          root: { 
                            color: '#323130', 
                            fontWeight: 600,
                            fontSize: '20px',
                            lineHeight: '28px',
                            marginRight: 16
                          } 
                        }}>
                          {cleanroom.name}
                        </Text>
                        {isCurrentActive && (
                          <span style={{ 
                            padding: '4px 12px', 
                            backgroundColor: '#0078d4', 
                            color: 'white', 
                            borderRadius: 16, 
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <Text variant="medium" styles={{ 
                        root: { 
                          color: '#605e5c', 
                          lineHeight: '20px',
                          marginBottom: 16
                        } 
                      }}>
                        {cleanroom.description}
                      </Text>
                      
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: 16,
                          backgroundColor: isActive ? '#d4edda' : isPending ? '#fff3cd' : '#f8d7da',
                          color: isActive ? '#155724' : isPending ? '#856404' : '#721c24',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {isActive ? 'Active' : isPending ? 'Pending Invitation' : 'Inactive'}
                        </div>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: 16,
                          backgroundColor: isOwner ? '#e7f1ff' : '#f8f9fa',
                          color: isOwner ? '#0078d4' : '#605e5c',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {userMembership?.role || 'Member'}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                      <PrimaryButton
                        text="Go to Collaboration"
                        onClick={() => handleSelectCleanroom(cleanroom)}
                        styles={{ 
                          root: { 
                            minWidth: 160,
                            height: 40,
                            borderRadius: 6,
                            backgroundColor: '#0078d4',
                            borderColor: '#0078d4'
                          } 
                        }}
                      />
                    </div>
                    
                    <div style={{ 
                      borderTop: '1px solid #f3f2f1',
                      paddingTop: 16,
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      color: '#8a8886'
                    }}>
                      <span style={{ fontWeight: 500 }}>
                        {cleanroom.members.length} member{cleanroom.members.length !== 1 ? 's' : ''}
                      </span>
                      <span>Created: {cleanroom.createdDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MembersPage({ members, setMembers, loggedInUser, datasets, setDatasets, initialTab, activeCleanroom }: { 
  members: any[], 
  setMembers: (ms: any[]) => void, 
  loggedInUser: any,
  datasets: any[],
  setDatasets: (ds: any[]) => void,
  initialTab?: 'invite' | 'view',
  activeCleanroom?: any
}) {
  const isOwner = loggedInUser.email === 'amit@contoso.com';
  const [activeTab, setActiveTab] = useState<'invite' | 'view'>(initialTab || 'view');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteOrg, setInviteOrg] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // Available workloads in the collaboration
  const availableWorkloads = [
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Privacy-preserving data analytics and insights',
      icon: 'BarChart4'
    }
  ];

  const selectedWorkload = localStorage.getItem(`selectedWorkload_${activeCleanroom?.id}`);

  const validateEmail = (email: string) => {
    // Basic validation for Microsoft work/school or Azure account format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInviteMember = async () => {
    if (!inviteEmail || !inviteName || !inviteOrg) {
      alert('Please fill in all fields');
      return;
    }

    if (!validateEmail(inviteEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Check if member already exists
    if (members.find(m => m.email === inviteEmail)) {
      alert('This member is already in the cleanroom');
      return;
    }

    setIsInviting(true);

    // Simulate invitation process
    setTimeout(() => {
      const newMember = {
        name: inviteName,
        email: inviteEmail,
        org: inviteOrg,
        status: 'Invited'
      };

      setMembers([...members, newMember]);
      
      // Reset form
      setInviteEmail('');
      setInviteName('');
      setInviteOrg('');
      setIsInviting(false);

      alert(`Invitation sent to ${inviteEmail}`);
      // Switch back to view tab after successful invite
      setActiveTab('view');
    }, 1500);
  };

  const handleAcceptInvitation = () => {
    // Update the logged-in user's status from 'Invited' to 'Active'
    const updatedMembers = members.map(member => 
      member.email === loggedInUser.email 
        ? { ...member, status: 'Active' }
        : member
    );
    setMembers(updatedMembers);
    alert('Invitation accepted! You are now an active member of the collaboration.');
  };

  const handleSelectWorkload = (workloadId: string) => {
    if (activeCleanroom) {
      // Temporarily set workload for navigation but don't persist it
      localStorage.setItem(`selectedWorkload_${activeCleanroom.id}`, workloadId);
      // Navigate to Summary page to show full collaboration interface
      window.location.href = '/summary';
    }
  };

  // Clear workload selection when coming back to members page
  const clearWorkloadSelection = () => {
    if (activeCleanroom) {
      localStorage.removeItem(`selectedWorkload_${activeCleanroom.id}`);
    }
  };

  // Clear workload on component mount if on members page
  React.useEffect(() => {
    clearWorkloadSelection();
  }, []);

  const handleDeclineInvitation = () => {
    // Remove the user from the members list
    const updatedMembers = members.filter(member => member.email !== loggedInUser.email);
    setMembers(updatedMembers);
    alert('Invitation declined. You have been removed from this collaboration.');
  };

  const handleDeleteMembership = (memberEmail: string, memberName: string) => {
    // Prevent deletion of collaboration owner
    if (memberEmail === 'amit@contoso.com') {
      alert('Cannot delete collaboration owner. The collaboration must have an owner.');
      return;
    }

    // Map email domains to provider names
    const getProviderFromEmail = (email: string) => {
      if (email.includes('@contoso.com')) return 'Contoso';
      if (email.includes('@fabrikam.com')) return 'Fabrikam';
      if (email.includes('@litware.com')) return 'Litware';
      return null;
    };

    const provider = getProviderFromEmail(memberEmail);
    
    if (confirm(`Delete ${memberName}'s membership? This will:\n• Remove ${memberName} from the collaboration\n• Delete all datasets published by ${provider}\n• This action cannot be undone.`)) {
      // Remove the member
      const updatedMembers = members.filter(member => member.email !== memberEmail);
      setMembers(updatedMembers);
      
      // Remove all datasets from this provider
      if (provider) {
        const updatedDatasets = datasets.filter(dataset => dataset.provider !== provider);
        setDatasets(updatedDatasets);
        const datasetsToStore = updatedDatasets.filter(ds => ds.name !== 'consumer_input');
        localStorage.setItem('datasets', JSON.stringify(datasetsToStore));
      }
      
      alert(`${memberName} has been removed from the collaboration and all ${provider} datasets have been deleted.`);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#faf9f8', 
      minHeight: '100vh', 
      padding: '0' 
    }}>
      {/* Header Section - Azure Portal Style */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e1dfdd',
        padding: '24px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          maxWidth: 1400,
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 600, 
              margin: '0 0 8px 0',
              color: '#323130'
            }}>
              Members
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#605e5c', 
              margin: 0,
              lineHeight: '22px'
            }}>
              Invite and manage collaborators who can publish datasets, create and approve queries
            </p>
          </div>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8f9fa',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e1dfdd'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#107c10'
              }} />
              <span style={{ 
                fontSize: '14px',
                color: '#323130',
                fontWeight: 500
              }}>
                {members.filter(m => m.status === 'Active').length} active
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8f9fa',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e1dfdd'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#0078d4'
              }} />
              <span style={{ 
                fontSize: '14px',
                color: '#323130',
                fontWeight: 500
              }}>
                {members.filter(m => m.status === 'Invited').length} invited
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div style={{ 
        maxWidth: 1400, 
        margin: '32px auto',
        padding: '0 32px'
      }}>
        {/* Tab Navigation - Azure Portal Style */}
        <div style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '12px 12px 0 0',
          border: '1px solid #e1dfdd',
          borderBottom: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex',
            borderBottom: '1px solid #e1dfdd',
            padding: '0 8px'
          }}>
            {isOwner && (
            <button
              onClick={() => setActiveTab('invite')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'invite' ? '#ffffff' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'invite' ? '3px solid #0078d4' : '3px solid transparent',
                fontSize: '15px',
                fontWeight: activeTab === 'invite' ? 600 : 500,
                color: activeTab === 'invite' ? '#0078d4' : '#605e5c',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '8px 8px 0 0',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '16px' }}>�</span>
              Invite Member
            </button>
            )}
            <button
              onClick={() => setActiveTab('view')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'view' ? '#ffffff' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'view' ? '3px solid #0078d4' : '3px solid transparent',
                fontSize: '15px',
                fontWeight: activeTab === 'view' ? 600 : 500,
                color: activeTab === 'view' ? '#0078d4' : '#605e5c',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '8px 8px 0 0',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '16px' }}>📋</span>
              View Members
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e1dfdd',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          minHeight: '500px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {activeTab === 'invite' && isOwner ? (
            // Invite Member Tab
            <div style={{ padding: '32px' }}>
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e1dfdd',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '32px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#0078d4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      i
                    </div>
                    <h2 style={{ 
                      fontSize: '20px', 
                      fontWeight: 600, 
                      margin: 0,
                      color: '#323130'
                    }}>
                      Invite New Member
                    </h2>
                  </div>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#605e5c', 
                    margin: 0,
                    lineHeight: '22px'
                  }}>
                    Send an invitation to join this cleanroom. The invitee must have a Microsoft Work/School or Azure account to access shared datasets and collaborate on queries.
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '24px' }}>
                  {/* Name Field */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#323130',
                      marginBottom: '8px'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="Enter full name"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        border: '1px solid #d1d1d1',
                        fontSize: '15px',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#0078d4'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d1d1'}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#323130',
                      marginBottom: '8px'
                    }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@company.com"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        border: '1px solid #d1d1d1',
                        fontSize: '15px',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#0078d4'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d1d1'}
                    />
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#605e5c', 
                      margin: '6px 0 0 0',
                      lineHeight: '18px'
                    }}>
                      Must be a Microsoft Work/School or Azure account
                    </p>
                  </div>

                  {/* Organization Field */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#323130',
                      marginBottom: '8px'
                    }}>
                      Organization *
                    </label>
                    <input
                      type="text"
                      value={inviteOrg}
                      onChange={(e) => setInviteOrg(e.target.value)}
                      placeholder="Company or organization name"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        border: '1px solid #d1d1d1',
                        fontSize: '15px',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#0078d4'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d1d1'}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    marginTop: '16px',
                    paddingTop: '24px',
                    borderTop: '1px solid #f3f2f1'
                  }}>
                    <button
                      onClick={handleInviteMember}
                      disabled={isInviting || !inviteEmail || !inviteName || !inviteOrg}
                      style={{
                        backgroundColor: isInviting || !inviteEmail || !inviteName || !inviteOrg ? '#f3f2f1' : '#0078d4',
                        color: isInviting || !inviteEmail || !inviteName || !inviteOrg ? '#a19f9d' : '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: isInviting || !inviteEmail || !inviteName || !inviteOrg ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = '#106ebe';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = '#0078d4';
                        }
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>📤</span>
                      {isInviting ? 'Sending Invitation...' : 'Send Invitation'}
                    </button>
                    <button
                      onClick={() => {
                        setInviteEmail('');
                        setInviteName('');
                        setInviteOrg('');
                      }}
                      disabled={isInviting}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#323130',
                        border: '1px solid #d1d1d1',
                        borderRadius: '6px',
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: 500,
                        cursor: isInviting ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      Clear Form
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // View Members Tab
            <div style={{ padding: '32px' }}>
              {/* Invitation notification for invited members */}
              {loggedInUser.status === 'Invited' && (
                <div style={{
                  backgroundColor: '#fff4e6',
                  border: '1px solid #ffd33d',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ffd33d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      ⚠️
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#8a6700', marginBottom: '4px' }}>
                        Pending Invitation
                      </div>
                      <div style={{ color: '#8a6700', fontSize: '14px' }}>
                        You have been invited to join this collaboration. Please accept or decline the invitation.
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={handleAcceptInvitation}
                      style={{
                        backgroundColor: '#107c10',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0e6b0e'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#107c10'}
                    >
                      Accept Invitation
                    </button>
                    <button
                      onClick={handleDeclineInvitation}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#8a6700',
                        border: '1px solid #ffd33d',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffd33d';
                        e.currentTarget.style.color = '#8a6700';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#8a6700';
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e1dfdd',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#0078d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    📋
                  </div>
                  <h2 style={{ 
                    fontSize: '20px', 
                    fontWeight: 600, 
                    margin: 0,
                    color: '#323130'
                  }}>
                    Member Directory
                  </h2>
                </div>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#605e5c', 
                  margin: 0,
                  lineHeight: '22px'
                }}>
                  View and manage all members who have access to this cleanroom. Monitor member status and manage permissions.
                </p>
              </div>

              {/* Member Statistics */}
              <div style={{ 
                display: 'flex', 
                gap: '24px', 
                marginBottom: '32px'
              }}>
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e1dfdd',
                  borderRadius: '8px',
                  padding: '20px',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#dff6dd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#107c10'
                    }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#323130' }}>
                      {members.filter(m => m.status === 'Active').length}
                    </div>
                    <div style={{ fontSize: '14px', color: '#605e5c' }}>Active Members</div>
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e1dfdd',
                  borderRadius: '8px',
                  padding: '20px',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#deecf9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#0078d4'
                    }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#323130' }}>
                      {members.filter(m => m.status === 'Invited').length}
                    </div>
                    <div style={{ fontSize: '14px', color: '#605e5c' }}>Pending Invitations</div>
                  </div>
                </div>
              </div>

              {/* Members Table - Azure Portal Style */}
              <div style={{ 
                border: '1px solid #e1dfdd',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  backgroundColor: '#ffffff'
                }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #e1dfdd'
                    }}>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '16px 20px', 
                        color: '#323130', 
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Name
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '16px 20px', 
                        color: '#323130', 
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Email
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '16px 20px', 
                        color: '#323130', 
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Organization
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '16px 20px', 
                        color: '#323130', 
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Status
                      </th>
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '16px 20px', 
                        color: '#323130', 
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m: any, index: number) => (
                      <tr 
                        key={m.email} 
                        style={{ 
                          borderBottom: index < members.length - 1 ? '1px solid #f3f2f1' : 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ 
                          padding: '20px', 
                          fontWeight: 500,
                          fontSize: '15px',
                          color: '#323130'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#0078d4',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: 600
                            }}>
                              {m.name.charAt(0)}
                            </div>
                            {m.name}
                          </div>
                        </td>
                        <td style={{ 
                          padding: '20px', 
                          color: '#0078d4',
                          fontSize: '15px'
                        }}>
                          {m.email}
                        </td>
                        <td style={{ 
                          padding: '20px', 
                          color: '#605e5c',
                          fontSize: '15px'
                        }}>
                          {m.org}
                        </td>
                        <td style={{ padding: '20px' }}>
                          {m.status === 'Active' ? (
                            <span style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              backgroundColor: '#dff6dd',
                              color: '#107c10',
                              padding: '6px 12px',
                              borderRadius: '16px',
                              fontSize: '13px',
                              fontWeight: 600
                            }}>
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#107c10'
                              }} />
                              Active
                            </span>
                          ) : (
                            <span style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              backgroundColor: '#deecf9',
                              color: '#0078d4',
                              padding: '6px 12px',
                              borderRadius: '16px',
                              fontSize: '13px',
                              fontWeight: 600
                            }}>
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#0078d4'
                              }} />
                              Invited
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '20px', textAlign: 'center' }}>
                          {/* Actions for invited members */}
                          {m.status === 'Invited' && m.email === loggedInUser.email && (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={handleAcceptInvitation}
                                style={{
                                  backgroundColor: '#107c10',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0e6b0e'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#107c10'}
                              >
                                Accept
                              </button>
                              <button
                                onClick={handleDeclineInvitation}
                                style={{
                                  backgroundColor: 'transparent',
                                  color: '#d13438',
                                  border: '1px solid #d13438',
                                  borderRadius: '4px',
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#d13438';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#d13438';
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          )}
                          {/* Actions for owner to manage other members */}
                          {isOwner && m.email !== loggedInUser.email && m.status === 'Active' && (
                            <button
                              onClick={() => handleDeleteMembership(m.email, m.name)}
                              style={{
                                backgroundColor: 'transparent',
                                color: '#d13438',
                                border: '1px solid #d13438',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#d13438';
                                e.currentTarget.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#d13438';
                              }}
                            >
                              Delete Membership
                            </button>
                          )}
                          {/* Actions for owner to cancel pending invitations */}
                          {isOwner && m.email !== loggedInUser.email && m.status === 'Invited' && (
                            <button
                              onClick={() => {
                                if (confirm(`Cancel invitation for ${m.name}?`)) {
                                  const updatedMembers = members.filter(member => member.email !== m.email);
                                  setMembers(updatedMembers);
                                  alert(`Invitation for ${m.name} has been cancelled.`);
                                }
                              }}
                              style={{
                                backgroundColor: 'transparent',
                                color: '#8a6700',
                                border: '1px solid #ffd33d',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#ffd33d';
                                e.currentTarget.style.color = '#8a6700';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#8a6700';
                              }}
                            >
                              Cancel Invitation
                            </button>
                          )}
                          {/* Self-delete membership for active members (not owner) */}
                          {m.email === loggedInUser.email && m.status === 'Active' && !isOwner && (
                            <button
                              onClick={() => handleDeleteMembership(m.email, m.name)}
                              style={{
                                backgroundColor: 'transparent',
                                color: '#d13438',
                                border: '1px solid #d13438',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#d13438';
                                e.currentTarget.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#d13438';
                              }}
                            >
                              Delete My Membership
                            </button>
                          )}
                          {/* No actions for owner's own row or for non-owners viewing others */}
                          {(m.email === loggedInUser.email && m.status === 'Active' && isOwner) || 
                           (!isOwner && m.email !== loggedInUser.email) ? (
                            <span style={{ color: '#8a8886', fontSize: '12px', fontStyle: 'italic' }}>
                              —
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Available Workloads - Shown for pending users but disabled */}
              {members.find(m => m.email === loggedInUser.email)?.status === 'Invited' && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e1dfdd',
                  borderRadius: '8px',
                  padding: '24px',
                  marginTop: '32px',
                  marginBottom: '32px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#8a8886',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      💼
                    </div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      margin: 0,
                      color: '#323130'
                    }}>
                      Available Workloads
                    </h3>
                  </div>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#605e5c', 
                    margin: '0 0 20px 0',
                    lineHeight: '22px'
                  }}>
                    These workloads will be available once you accept the collaboration invitation.
                  </p>
                  
                  <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {availableWorkloads.map(workload => (
                      <div
                        key={workload.id}
                        style={{
                          border: '2px solid #e1dfdd',
                          borderRadius: '8px',
                          padding: '20px',
                          backgroundColor: '#ffffff',
                          opacity: 0.6,
                          cursor: 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: '#f3f2f1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}>
                          📊
                        </div>
                        <div>
                          <h4 style={{ 
                            fontSize: '16px', 
                            fontWeight: 600, 
                            margin: '0 0 4px 0',
                            color: '#8a8886'
                          }}>
                            {workload.name}
                          </h4>
                          <p style={{ 
                            fontSize: '14px', 
                            color: '#8a8886', 
                            margin: 0,
                            lineHeight: '20px'
                          }}>
                            {workload.description}
                          </p>
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: '#8a8886',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          LOCKED
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Workload Selection - Appears after members table for active users */}
              {members.find(m => m.email === loggedInUser.email)?.status === 'Active' && (
                <div style={{
                  backgroundColor: '#e7f1ff',
                  border: '2px solid #0078d4',
                  borderRadius: '12px',
                  padding: '32px',
                  marginTop: '32px'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#0078d4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 auto 16px'
                    }}>
                      🚀
                    </div>
                    <h3 style={{ 
                      fontSize: '24px', 
                      fontWeight: 600, 
                      margin: '0 0 8px 0',
                      color: '#0078d4'
                    }}>
                      Ready to Start?
                    </h3>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#605e5c', 
                      margin: '0 0 24px 0',
                      lineHeight: '24px',
                      maxWidth: '600px',
                      margin: '0 auto'
                    }}>
                      Select a workload to access the full collaboration environment with datasets, queries, and analytics tools.
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', maxWidth: '800px', width: '100%' }}>
                      {availableWorkloads.map(workload => (
                        <div
                          key={workload.id}
                          onClick={() => handleSelectWorkload(workload.id)}
                          style={{
                            border: '2px solid #d1d1d1',
                            borderRadius: '12px',
                            padding: '24px',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#0078d4';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,120,212,0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#d1d1d1';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            e.currentTarget.style.transform = 'translateY(0px)';
                          }}
                        >
                          <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            marginBottom: '16px'
                          }}>
                            📊
                          </div>
                          <h4 style={{ 
                            fontSize: '20px', 
                            fontWeight: 600, 
                            margin: '0 0 8px 0',
                            color: '#323130'
                          }}>
                            {workload.name}
                          </h4>
                          <p style={{ 
                            fontSize: '15px', 
                            color: '#605e5c', 
                            margin: '0 0 20px 0',
                            lineHeight: '22px'
                          }}>
                            {workload.description}
                          </p>
                          <div style={{
                            backgroundColor: '#0078d4',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer'
                          }}>
                            Enter {workload.name} →
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock dataset and query data
type InputKMin = {
  id: string;
  datasetName: string;
  value: string | number;
};

type QuerySegment = {
  id: string;
  sql: string;
  kminField: string;
  kminValue: string | number;
  inputKMins: InputKMin[];
};

type Query = {
  id: number;
  sql?: string; // Legacy single query support
  segments?: QuerySegment[]; // New multi-segment support
  description?: string; // Optional description for the query
  kminField?: string; // Legacy field
  kminValue?: string | number; // Legacy field
  inputKMins?: InputKMin[]; // Input k-mins for single queries
  selectedInputDatasets: string[]; // Array of input dataset names referenced in the query
  resultsLocations: string[]; // Array of Data sink IDs for query results
  status: string;
  cleanroomId?: string; // ID of the cleanroom this query belongs to
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  executions: Array<{
    runId: number;
    startedAt: string;
    completedAt?: string;
    status: 'running' | 'completed' | 'failed' | 'stopped';
    duration?: number;
    queryStartDate?: string;
    queryEndDate?: string;
  }>;
  totalRuns: number;
};

function SummaryPage(props: { datasets: any[], loggedInUser?: any, activeCleanroom?: any }) {
  const navigate = useNavigate();
  
  // State for expandable queries
  const [expandedQueries, setExpandedQueries] = useState<{[key: string]: boolean}>({});
  
  // Get actual queries from localStorage (same source as QueriesPage)
  const getStoredQueries = () => {
    const stored = localStorage.getItem('queries');
    if (stored) return JSON.parse(stored);
    
    // If no queries in localStorage, return the default queries from the app
    return [
      {
        id: 1,
        description: 'Video campaign',
        sql: `SELECT advertiser_id, COUNT(*) as campaign_count, SUM(t_val) as total_value
FROM contoso_input ci
JOIN fabrikam_audience_data fad ON ci.advertiser_id = fad.user_id
WHERE ci.country = 'US' AND fad.engagement_score > 0.7
GROUP BY advertiser_id
HAVING COUNT(*) >= 100`,
        kminField: 'advertiser_id',
        kminValue: '100',
        selectedInputDatasets: ['contoso_input', 'fabrikam_audience_data'],
        resultsLocations: ['s3://measurement-results/cross-platform-analysis'],
        status: 'approved',
        executions: [
          {
            id: 'R001',
            status: 'completed'
          },
          {
            id: 'R002',
            status: 'completed'
          },
          {
            id: 'R003',
            status: 'failed',
            error: 'Input Threshold for "publisher_data" set to 300 but got only 290'
          },
          {
            id: 'R004',
            status: 'completed'
          }
        ],
        totalRuns: 4,
        cleanroomId: 'cr-1',
      },
      {
        id: 2,
        description: 'Video campaign - segmented',
        sql: `SELECT product_category, COUNT(DISTINCT customer_id) as unique_customers, 
       AVG(purchase_amount) as avg_purchase
FROM retail_transaction_data
WHERE transaction_date >= '2024-01-01'
GROUP BY product_category
HAVING COUNT(DISTINCT customer_id) >= 500`,
        kminField: 'customer_id',
        kminValue: '500',
        selectedInputDatasets: ['retail_transaction_data'],
        resultsLocations: ['s3://retail-insights/category-analysis'],
        status: 'pending',
        executions: [],
        totalRuns: 0,
        cleanroomId: 'cr-3',
      },
      {
        id: 3,
        description: 'Healthcare research analysis',
        sql: `SELECT treatment_type, COUNT(*) as patient_count, AVG(outcome_score) as avg_outcome
FROM healthcare_patient_outcomes
WHERE demographics LIKE '%adult%'
GROUP BY treatment_type
HAVING COUNT(*) >= 1000`,
        kminField: 'patient_id',
        kminValue: '1000',
        selectedInputDatasets: ['healthcare_patient_outcomes'],
        resultsLocations: ['s3://healthcare-research/treatment-outcomes'],
        status: 'approved',
        executions: [
          {
            id: 'R005',
            status: 'running'
          },
          {
            id: 'R006',
            status: 'stopped',
            error: 'Manually stopped by user'
          },
          {
            id: 'R007',
            status: 'failed',
            error: 'Access denied to healthcare_patient_outcomes: insufficient permissions for demographic data'
          }
        ],
        totalRuns: 3,
        cleanroomId: 'cr-4',
      }
    ];
  };

  const queries = getStoredQueries();

  // Helper functions to calculate statistics based on actual data
  const getMyDatasets = () => {
    // Get the current user's organization - handle different ways org might be stored
    let userOrg = props.loggedInUser?.org;
    
    // If org is not set, derive it from email
    if (!userOrg && props.loggedInUser?.email) {
      if (props.loggedInUser.email.includes('@fabrikam.com')) {
        userOrg = 'Fabrikam';
      } else if (props.loggedInUser.email.includes('@contoso.com')) {
        userOrg = 'Contoso';
      } else if (props.loggedInUser.email.includes('@adventure-works.com')) {
        userOrg = 'Adventure Works';
      } else if (props.loggedInUser.email.includes('@northwind.com')) {
        userOrg = 'Northwind';
      }
    }
    
    console.log('User organization determined as:', userOrg);
    console.log('Available datasets:', props.datasets.map(ds => ({ name: ds.name, provider: ds.provider, cleanroom: ds.cleanroomId })));
    
    // Show detailed dataset info
    props.datasets.forEach((ds, index) => {
      console.log(`Dataset ${index + 1}:`, {
        name: ds.name,
        provider: ds.provider,
        cleanroomId: ds.cleanroomId,
        matchesUser: ds.provider === userOrg
      });
    });
    
    // Filter datasets by the user's organization
    const myDatasets = props.datasets.filter(ds => ds.provider === userOrg);
    
    console.log('My datasets (by org):', myDatasets.map(ds => ({ name: ds.name, provider: ds.provider })));
    
    return myDatasets;
  };

  const getMyQueriesUsingMyDatasets = () => {
    const myDatasetNames = getMyDatasets().map(ds => ds.name);
    
    console.log('My dataset names:', myDatasetNames);
    console.log('All queries:', queries.map((q: any) => ({ id: q.id, datasets: q.selectedInputDatasets, status: q.status })));
    
    // Filter queries that use my datasets (ignore cleanroom for now to see if we get any matches)
    const matchingQueries = queries.filter((query: any) => 
      query.selectedInputDatasets && 
      query.selectedInputDatasets.some((datasetName: string) => myDatasetNames.includes(datasetName))
    );
    
    console.log('Queries using my datasets:', matchingQueries.map((q: any) => ({ id: q.id, datasets: q.selectedInputDatasets })));
    
    return matchingQueries;
  };

  const getPendingQueries = () => {
    return getMyQueriesUsingMyDatasets().filter((q: any) => q.status === 'pending');
  };

  const getApprovedQueries = () => {
    return getMyQueriesUsingMyDatasets().filter((q: any) => q.status === 'approved');
  };

  const getRunningQueries = () => {
    return getApprovedQueries().filter((q: any) => 
      q.executions && q.executions.some((exec: any) => exec.status === 'running')
    );
  };

  // Calculate actual statistics
  const myDatasets = getMyDatasets();
  const totalApprovedColumns = myDatasets.reduce((sum, ds) => 
    sum + ds.columns.filter((col: any) => col.approved).length, 0
  );
  const totalColumns = myDatasets.reduce((sum, ds) => sum + ds.columns.length, 0);

  const pendingQueries = getPendingQueries();
  const approvedQueries = getApprovedQueries();
  const runningQueries = getRunningQueries();

  console.log('Summary page statistics:', {
    myDatasets: myDatasets.length,
    totalApprovedColumns,
    totalColumns,
    pendingQueries: pendingQueries.length,
    approvedQueries: approvedQueries.length,
    runningQueries: runningQueries.length,
    totalQueriesUsingMyDatasets: getMyQueriesUsingMyDatasets().length
  });

  // Debug logging
  console.log('=== SUMMARY PAGE DEBUG ===');
  console.log('User email:', props.loggedInUser?.email);
  console.log('User org:', props.loggedInUser?.org);
  console.log('Active cleanroom ID:', props.activeCleanroom?.id);
  console.log('Total datasets count:', props.datasets?.length || 0);
  console.log('Total queries count:', queries?.length || 0);
  console.log('My datasets count:', myDatasets?.length || 0);
  console.log('Queries using my datasets count:', getMyQueriesUsingMyDatasets()?.length || 0);
  console.log('========================');

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '40px 32px',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <Text variant="xxLarge" styles={{ 
          root: { 
            fontWeight: 600, 
            color: '#323130',
            marginBottom: '8px',
            display: 'block'
          } 
        }}>
          Activity Summary
        </Text>
        <Text variant="large" styles={{ 
          root: { 
            color: '#605e5c',
            marginBottom: '32px',
            display: 'block'
          } 
        }}>
          Overview of your cleanroom activities and data usage
        </Text>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Datasets Published */}
        <div 
          onClick={() => navigate('/publish')}
          style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e1dfdd',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              backgroundColor: '#e8f4fd', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px'
            }}>
              <span style={{ fontSize: '28px' }}>📊</span>
            </div>
            <div style={{ flex: 1 }}>
              <Text variant="large" styles={{ root: { fontWeight: 600, color: '#323130', marginBottom: '8px' } }}>
                Datasets Published
              </Text>
              <Text styles={{ root: { fontSize: '40px', fontWeight: 700, color: '#0078d4', lineHeight: '1.1' } }}>
                {myDatasets.length}
              </Text>
            </div>
          </div>
          <Text styles={{ root: { color: '#605e5c', fontSize: '14px' } }}>
            {totalApprovedColumns} of {totalColumns} columns approved
          </Text>
        </div>

        {/* Pending Approval */}
        <div 
          onClick={() => navigate('/queries')}
          style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e1dfdd',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              backgroundColor: '#fff4e5', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px'
            }}>
              <span style={{ fontSize: '28px' }}>⏳</span>
            </div>
            <div style={{ flex: 1 }}>
              <Text variant="large" styles={{ root: { fontWeight: 600, color: '#323130', marginBottom: '8px' } }}>
                Pending Approval
              </Text>
              <Text styles={{ root: { fontSize: '40px', fontWeight: 700, color: '#d29200', lineHeight: '1.1' } }}>
                {pendingQueries.length}
              </Text>
            </div>
          </div>
          <Text styles={{ root: { color: '#605e5c', fontSize: '14px' } }}>
            Queries using your datasets
          </Text>
        </div>

        {/* Approved Queries */}
        <div 
          onClick={() => navigate('/queries')}
          style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e1dfdd',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              backgroundColor: '#e8f5e8', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px'
            }}>
              <span style={{ fontSize: '28px' }}>✅</span>
            </div>
            <div style={{ flex: 1 }}>
              <Text variant="large" styles={{ root: { fontWeight: 600, color: '#323130', marginBottom: '8px' } }}>
                Approved Queries
              </Text>
              <Text styles={{ root: { fontSize: '40px', fontWeight: 700, color: '#237f23', lineHeight: '1.1' } }}>
                {approvedQueries.length}
              </Text>
            </div>
          </div>
          <Text styles={{ root: { color: '#605e5c', fontSize: '14px' } }}>
            Ready for execution
          </Text>
        </div>

        {/* Running Queries */}
        <div 
          onClick={() => navigate('/queries')}
          style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e1dfdd',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              backgroundColor: '#f3e5f5', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px'
            }}>
              <span style={{ fontSize: '28px' }}>🔄</span>
            </div>
            <div style={{ flex: 1 }}>
              <Text variant="large" styles={{ root: { fontWeight: 600, color: '#323130', marginBottom: '8px' } }}>
                Currently Running
              </Text>
              <Text styles={{ root: { fontSize: '40px', fontWeight: 700, color: '#8b5a9b', lineHeight: '1.1' } }}>
                {runningQueries.length}
              </Text>
            </div>
          </div>
          <Text styles={{ root: { color: '#605e5c', fontSize: '14px' } }}>
            Active executions
          </Text>
        </div>
      </div>

      {/* Queries Utilizing My Datasets Table */}
      <div style={{ 
        backgroundColor: '#ffffff',
        border: '1px solid #e1dfdd',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <Text variant="xLarge" styles={{ root: { fontWeight: 600, marginBottom: '8px', color: '#323130' } }}>
          Queries Utilizing My Datasets
        </Text>
        <div style={{ 
          fontSize: '14px', 
          color: '#605e5c', 
          marginBottom: '24px',
          lineHeight: '20px',
          fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif'
        }}>
          All queries that reference your published datasets
        </div>

        {getMyQueriesUsingMyDatasets().length > 0 ? (
          <div style={{ 
            border: '1px solid #e1dfdd',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 120px 120px 140px 80px 120px',
              gap: '16px',
              padding: '16px 20px',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e1dfdd',
              fontWeight: 600,
              fontSize: '14px',
              color: '#323130'
            }}>
              <div>Query ID</div>
              <div>Description</div>
              <div>Approval Status</div>
              <div>Execution Status</div>
              <div>Action</div>
              <div>Runs</div>
              <div>Avg Run Time</div>
            </div>

            {/* Table Rows */}
            {getMyQueriesUsingMyDatasets().map((query: any, index: number) => {
              console.log('Query executions:', query.id, query.executions);
              const isRunning = query.executions && query.executions.some((e: any) => e.status === 'running');
              const lastExecution = query.executions && query.executions.length > 0 
                ? query.executions[query.executions.length - 1] 
                : null;
              const isExpanded = expandedQueries[query.id];
              
              return (
                <div key={query.id}>
                  <div 
                    onClick={() => setExpandedQueries((prev: {[key: string]: boolean}) => ({ ...prev, [query.id]: !prev[query.id] }))}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 120px 120px 140px 80px 120px',
                      gap: '16px',
                      padding: '16px 20px',
                      borderBottom: !isExpanded && index < getMyQueriesUsingMyDatasets().length - 1 ? '1px solid #e1dfdd' : 'none',
                      backgroundColor: isExpanded ? '#f8f9fa' : (index % 2 === 0 ? '#ffffff' : '#fafafa'),
                      alignItems: 'center',
                      fontSize: '14px',
                      color: '#323130',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!isExpanded) {
                        e.currentTarget.style.backgroundColor = '#f3f2f1';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isExpanded) {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fafafa';
                      }
                    }}
                  >
                  {/* Query ID */}
                  <div style={{ fontWeight: 600 }}>#{query.id}</div>
                  
                  {/* Description */}
                  <div style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    color: query.description ? '#323130' : '#a19f9d',
                    fontStyle: query.description ? 'normal' : 'italic'
                  }}>
                    {query.description || 'No description provided'}
                  </div>
                  
                  {/* Approval Status */}
                  <div>
                    <div style={{ 
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 500,
                      textAlign: 'center',
                      backgroundColor: 
                        query.status === 'approved' ? '#e8f5e8' :
                        query.status === 'pending' ? '#fff4e5' : '#fdeaea',
                      color: 
                        query.status === 'approved' ? '#237f23' :
                        query.status === 'pending' ? '#8a6914' : '#d13438'
                    }}>
                      {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                    </div>
                  </div>
                  
                  {/* Execution Status */}
                  <div>
                    {lastExecution ? (
                      <div style={{ 
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        textAlign: 'center',
                        backgroundColor: 
                          lastExecution.status === 'running' ? '#e1f5fe' :
                          lastExecution.status === 'completed' ? '#e8f5e8' :
                          lastExecution.status === 'stopped' ? '#fff4e5' : '#fdeaea',
                        color: 
                          lastExecution.status === 'running' ? '#0078d4' :
                          lastExecution.status === 'completed' ? '#237f23' :
                          lastExecution.status === 'stopped' ? '#8a6914' : '#d13438'
                      }}>
                        {lastExecution.status === 'running' ? '🔄 Running' :
                         lastExecution.status === 'completed' ? '✅ Completed' :
                         lastExecution.status === 'stopped' ? '⏹️ Stopped' : '❌ Failed'}
                      </div>
                    ) : (
                      <div style={{ 
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        textAlign: 'center',
                        backgroundColor: '#f3f2f1',
                        color: '#605e5c'
                      }}>
                        Not Run
                      </div>
                    )}
                  </div>
                  
                  {/* Action */}
                  <div>
                    {query.status === 'approved' ? (
                      isRunning ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentQueries = getStoredQueries();
                            const updatedQueries = currentQueries.map((q: any) => {
                              if (q.id === query.id && q.executions) {
                                const updatedExecutions = q.executions.map((exec: any) => 
                                  exec.status === 'running' ? { ...exec, status: 'stopped' } : exec
                                );
                                return { ...q, executions: updatedExecutions };
                              }
                              return q;
                            });
                            localStorage.setItem('queries', JSON.stringify(updatedQueries));
                            window.location.reload();
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#d13438',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          ⏹️ Stop
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentQueries = getStoredQueries();
                            const updatedQueries = currentQueries.map((q: any) => {
                              if (q.id === query.id) {
                                const newExecution = {
                                  id: Date.now(),
                                  status: 'running',
                                  timestamp: new Date().toISOString()
                                };
                                const updatedExecutions = q.executions ? [...q.executions, newExecution] : [newExecution];
                                const updatedTotalRuns = (q.totalRuns || 0) + 1;
                                return { ...q, executions: updatedExecutions, totalRuns: updatedTotalRuns };
                              }
                              return q;
                            });
                            localStorage.setItem('queries', JSON.stringify(updatedQueries));
                            window.location.reload();
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#0078d4',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          ▶️ Run
                        </button>
                      )
                    ) : (
                      <div style={{ 
                        padding: '6px 12px',
                        backgroundColor: '#f3f2f1',
                        color: '#a19f9d',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 500,
                        textAlign: 'center'
                      }}>
                        {query.status === 'pending' ? 'Pending' : 'Rejected'}
                      </div>
                    )}
                  </div>
                  
                  {/* Number of Runs */}
                  <div style={{ 
                    textAlign: 'center', 
                    fontWeight: 600,
                    color: '#0078d4'
                  }}>
                    {query.totalRuns || 0}
                  </div>
                  
                  {/* Average Run Time */}
                  <div style={{ 
                    textAlign: 'center', 
                    fontWeight: 500,
                    color: '#323130'
                  }}>
                    {(() => {
                      // Calculate average run time from executions
                      if (!query.executions || query.executions.length === 0) {
                        return 'N/A';
                      }
                      
                      const completedExecutions = query.executions.filter((exec: any) => 
                        exec.status === 'completed' && (exec.duration || (exec.startTime && exec.endTime))
                      );
                      
                      if (completedExecutions.length === 0) {
                        return 'N/A';
                      }
                      
                      const totalTime = completedExecutions.reduce((sum: number, exec: any) => {
                        let duration = exec.duration;
                        
                        // If no duration field, calculate from startTime and endTime
                        if (!duration && exec.startTime && exec.endTime) {
                          const start = new Date(exec.startTime).getTime();
                          const end = new Date(exec.endTime).getTime();
                          duration = (end - start) / 1000; // duration in seconds
                        }
                        
                        return sum + (duration || 0);
                      }, 0);
                      
                      const avgTime = totalTime / completedExecutions.length;
                      
                      // Format duration nicely
                      if (avgTime < 60) {
                        return `${Math.round(avgTime)}s`;
                      } else if (avgTime < 3600) {
                        return `${Math.round(avgTime / 60)}m`;
                      } else {
                        return `${Math.round(avgTime / 3600)}h`;
                      }
                    })()}
                  </div>
                </div>
                
                {/* Expandable Query Details */}
                {isExpanded && (
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#ffffff',
                    borderBottom: index < getMyQueriesUsingMyDatasets().length - 1 ? '1px solid #e1dfdd' : 'none',
                    borderTop: '1px solid #e1dfdd'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      marginBottom: '16px',
                      color: '#323130'
                    }}>
                      Query #{query.id} - Execution History
                    </div>
                    
                    {query.executions && query.executions.length > 0 ? (
                      <div>
                        {/* Execution History Header */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 120px 1fr',
                          gap: '16px',
                          padding: '12px 16px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px 6px 0 0',
                          fontWeight: 600,
                          fontSize: '13px',
                          color: '#323130',
                          border: '1px solid #e1dfdd'
                        }}>
                          <div>Run ID</div>
                          <div>Status</div>
                          <div>Error Details</div>
                        </div>
                        
                        {/* Execution History Rows */}
                        {query.executions.slice().reverse().map((execution: any, execIndex: number) => (
                          <div 
                            key={execution.id || `exec-${execIndex}`}
                            style={{
                              display: 'flex',
                              padding: '12px 16px',
                              backgroundColor: execIndex % 2 === 0 ? '#ffffff' : '#fafafa',
                              borderLeft: '1px solid #e1dfdd',
                              borderRight: '1px solid #e1dfdd',
                              borderBottom: execIndex === query.executions.length - 1 ? '1px solid #e1dfdd' : 'none',
                              fontSize: '13px',
                              color: '#323130',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ fontWeight: 500, width: '120px', paddingRight: '16px' }}>
                              {execIndex + 1}
                            </div>
                            
                            {/* Status */}
                            <div style={{ width: '120px', paddingRight: '16px' }}>
                              <div style={{ 
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 500,
                                textAlign: 'center',
                                backgroundColor: 
                                  execution.status === 'running' ? '#e1f5fe' :
                                  execution.status === 'completed' && execIndex !== 1 ? '#e8f5e8' :
                                  execution.status === 'stopped' ? '#fff4e5' : '#fdeaea',
                                color: 
                                  execution.status === 'running' ? '#0078d4' :
                                  execution.status === 'completed' && execIndex !== 1 ? '#237f23' :
                                  execution.status === 'stopped' ? '#8a6914' : '#d13438'
                              }}>
                                {execution.status === 'running' ? '🔄 Running' :
                                 execution.status === 'completed' && execIndex !== 1 ? '✅ Completed' :
                                 execution.status === 'stopped' ? '⏹️ Stopped' : '❌ Failed'}
                              </div>
                            </div>
                            
                            <div style={{ fontSize: '12px', flex: 1 }}>
                              {execIndex === 1 ? (
                                <span style={{ color: '#d13438' }}>
                                  Input Threshold for "publisher_data" set to 300 but got only 290
                                </span>
                              ) : (
                                <span style={{ color: '#605e5c' }}>-</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#605e5c',
                        fontSize: '14px',
                        fontStyle: 'italic',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        border: '1px solid #e1dfdd'
                      }}>
                        No execution history available for this query
                      </div>
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#605e5c'
          }}>
            <Text styles={{ root: { fontSize: '16px', fontStyle: 'italic' } }}>
              No queries using your datasets yet
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

function QueriesPage(props: { datasets: any[], dataSinks: any[], loggedInUser?: any, activeCleanroom?: any }) {
  // Helper: check for datasets with approved columns from at least 2 different providers
  const datasetsWithApprovedColumns = props.datasets.filter(ds => ds.columns.some((col: any) => col.approved));
  const uniqueProviders = [...new Set(datasetsWithApprovedColumns.map(ds => ds.provider))];
  const hasMultipleProviders = uniqueProviders.length >= 2;
  
  // Helper: check for enabled data sinks
  const hasEnabledDataSinks = props.dataSinks.some(sink => sink.enabled);
  
  // Helper: get pending queries for current cleanroom
  const getPendingQueries = () => {
    return queries.filter(q => q.status === 'pending' && (!props.activeCleanroom || q.cleanroomId === props.activeCleanroom.id));
  };
  const [sql, setSql] = useState('');
  const [description, setDescription] = useState('');
  const [kminField, setKminField] = useState('');
  const [kminValue, setKminValue] = useState('');
  const [resultsLocations, setResultsLocations] = useState<string[]>([]);
  
  // Segment-related state
  const [querySegments, setQuerySegments] = useState<Array<{
    id: string;
    startLine: number;
    endLine: number;
    name: string;
    inputKMins: Array<{ id: string; datasetName: string; value: string }>;
    outputKMinField: string;
    outputKMinValue: string;
    executionSequence: number;
  }>>([]);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; lineNumber: number }>({ visible: false, x: 0, y: 0, lineNumber: 0 });
  const [showSegmentDialog, setShowSegmentDialog] = useState(false);
  const [selectedLineForSegment, setSelectedLineForSegment] = useState<number | null>(null);
  const [selectedInputDatasets, setSelectedInputDatasets] = useState<string[]>([]);
  const [expandedSegments, setExpandedSegments] = useState<{[key: string]: boolean}>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [inputKMins, setInputKMins] = useState<InputKMin[]>([
    { id: '1', datasetName: '', value: '' }
  ]);
  
  // Reason for rejection state
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectingQueryId, setRejectingQueryId] = useState<number|null>(null);
  
  const [queries, setQueries] = useState<Query[]>(() => {
    const stored = localStorage.getItem('queries');
    if (stored) return JSON.parse(stored);
    return [
      {
        id: 1,
        sql: `SELECT advertiser_id, COUNT(*) as campaign_count, SUM(t_val) as total_value
FROM contoso_input ci
JOIN fabrikam_audience_data fad ON ci.advertiser_id = fad.user_id
WHERE ci.country = 'US' AND fad.engagement_score > 0.7
GROUP BY advertiser_id
HAVING COUNT(*) >= 100`,
        kminField: 'advertiser_id',
        kminValue: '100',
        selectedInputDatasets: ['contoso_input', 'fabrikam_audience_data'],
        resultsLocations: ['s3://measurement-results/cross-platform-analysis'],
        status: 'approved',
        executions: [],
        totalRuns: 0,
        cleanroomId: 'cr-1',
        approvedAt: '2024-10-05T14:30:00Z',
        approvedBy: 'Sarah Johnson'
      },
      {
        id: 2,
        sql: `SELECT product_category, COUNT(DISTINCT customer_id) as unique_customers, 
       AVG(purchase_amount) as avg_purchase
FROM retail_transaction_data
WHERE transaction_date >= '2024-01-01'
GROUP BY product_category
HAVING COUNT(DISTINCT customer_id) >= 500`,
        kminField: 'customer_id',
        kminValue: '500',
        selectedInputDatasets: ['retail_transaction_data'],
        resultsLocations: ['s3://retail-insights/category-analysis'],
        status: 'approved',
        executions: [
          {
            executionId: 'exec-001',
            startTime: '2024-10-01T09:15:00Z',
            endTime: '2024-10-01T09:18:30Z',
            status: 'completed',
            resultSizeBytes: 2048
          }
        ],
        totalRuns: 1,
        cleanroomId: 'cr-3',
        approvedAt: '2024-09-28T11:20:00Z',
        approvedBy: 'Lisa Chen'
      },
      {
        id: 3,
        sql: `SELECT treatment_type, COUNT(*) as patient_count, AVG(outcome_score) as avg_outcome
FROM healthcare_patient_outcomes
WHERE demographics LIKE '%adult%'
GROUP BY treatment_type
HAVING COUNT(*) >= 1000`,
        kminField: 'patient_id',
        kminValue: '1000',
        selectedInputDatasets: ['healthcare_patient_outcomes'],
        resultsLocations: ['s3://healthcare-research/treatment-outcomes'],
        status: 'approved',
        executions: [],
        totalRuns: 0,
        cleanroomId: 'cr-4',
        approvedAt: '2024-09-20T16:45:00Z',
        approvedBy: 'Dr. Elena Rodriguez'
      },
      {
        id: 4,
        sql: `SELECT account_type, COUNT(*) as account_count, AVG(risk_score) as avg_risk
FROM financial_risk_metrics
WHERE transaction_volume > 100
GROUP BY account_type
HAVING COUNT(*) >= 200`,
        kminField: 'account_id',
        kminValue: '200',
        selectedInputDatasets: ['financial_risk_metrics'],
        resultsLocations: ['s3://financial-analytics/risk-assessment'],
        status: 'pending',
        executions: [],
        totalRuns: 0,
        cleanroomId: 'cr-5'
      }
    ];
  });
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [tab, setTab] = useState<'create' | 'list'>('create');
  const [expandedTables, setExpandedTables] = useState<{[key: string]: boolean}>({});
  // const [outputPath, setOutputPath] = useState('s3://aws-clean-room-demo-results-999941039999');

  // Persist queries to localStorage on change
  useEffect(() => {
    localStorage.setItem('queries', JSON.stringify(queries));
  }, [queries]);

  // Handle clicking outside context menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.visible) {
        const target = event.target as Element;
        // Check if click is outside context menu
        if (!target.closest('[data-context-menu]')) {
          setContextMenu({ visible: false, x: 0, y: 0, lineNumber: 0 });
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  // Helper to get user-friendly status display text
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Helper function to check if query has missing k-min values
  const hasKMinWarnings = (query: Query) => {
    if (query.segments && query.segments.length > 0) {
      // Multi-segment query - check input threshold for ALL segments and output filter for final segment
      
      // Check input threshold for all segments
      for (let i = 0; i < query.segments.length; i++) {
        const segment = query.segments[i];
        const hasValidInputKMin = segment.inputKMins && 
                                  segment.inputKMins.length > 0 && 
                                  segment.inputKMins.some(kmin => 
                                    kmin.datasetName && kmin.datasetName.trim() !== '' && 
                                    kmin.value && String(kmin.value).trim() !== ''
                                  );
        if (!hasValidInputKMin) {
          return true; // Found a segment without input threshold
        }
      }
      
      // Check output filter for final segment
      const finalSegment = query.segments[query.segments.length - 1];
      const hasValidOutputKMin = finalSegment.kminValue && String(finalSegment.kminValue).trim() !== '';
      
      return !hasValidOutputKMin;
    } else {
      // Single query
      const hasValidInputKMin = query.inputKMins && 
                                query.inputKMins.length > 0 && 
                                query.inputKMins.some(kmin => 
                                  kmin.datasetName && kmin.datasetName.trim() !== '' && 
                                  kmin.value && String(kmin.value).trim() !== ''
                                );
      const hasValidOutputKMin = query.kminValue && String(query.kminValue).trim() !== '';
      
      return !hasValidInputKMin || !hasValidOutputKMin;
    }
  };

  // Validation function for form submission
  const isFormValid = () => {
    // Single query validation
    return sql.trim() && 
           selectedInputDatasets.length > 0 && 
           resultsLocations.length > 0 && 
           hasMultipleProviders;
  };

  // Segment management functions
  const getSegmentForLine = (lineNumber: number) => {
    return querySegments.find(segment => 
      lineNumber >= segment.startLine && lineNumber <= segment.endLine
    );
  };

  const handleLineRightClick = (e: React.MouseEvent, lineNumber: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Right clicked on line:', lineNumber);
    console.log('Setting context menu at:', e.clientX, e.clientY);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      lineNumber: lineNumber
    });
    console.log('Context menu state set to visible');
  };

  const handleContextMenuAction = (action: string) => {
    console.log('Context menu action:', action, 'for line:', contextMenu.lineNumber);
    if (action === 'create-segment') {
      setSelectedLineForSegment(contextMenu.lineNumber);
      setShowSegmentDialog(true);
    }
    setContextMenu({ visible: false, x: 0, y: 0, lineNumber: 0 });
  };

  const handleTextareaScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const toggleSegmentExpansion = (segmentId: string) => {
    setExpandedSegments(prev => ({
      ...prev,
      [segmentId]: !prev[segmentId]
    }));
  };

  const removeSegment = (segmentId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the expansion toggle
    if (window.confirm('Are you sure you want to remove this segment?')) {
      setQuerySegments(prev => prev.filter(segment => segment.id !== segmentId));
      // Clean up expanded state
      setExpandedSegments(prev => {
        const newState = { ...prev };
        delete newState[segmentId];
        return newState;
      });
    }
  };

  // Submit query for approval
  const handleSubmit = () => {
    if (!isFormValid()) return;
    
    // Single query approach
    const newQuery: Query = {
      id: queries.length + 1,
      sql,
      description: description.trim() || undefined,
      kminField,
      kminValue,
      inputKMins,
      selectedInputDatasets,
      resultsLocations,
      status: 'pending',
      cleanroomId: props.activeCleanroom?.id,
      executions: [],
      totalRuns: 0,
    };
    setQueries([...queries, newQuery]);
    setSql('');
    setDescription('');
    setKminField('');
    setKminValue('');
    setSelectedInputDatasets([]);
    setInputKMins([{ id: '1', datasetName: '', value: '' }]);
    setResultsLocations([]);
    setResultsLocations([]);
    setDescription('');
    setTab('list');
    
    // Show success notification
    alert(`Query #${queries.length + 1} has been submitted for approval and will appear in your pending queries list.`);
  };

  // Approve query
  const handleApprove = (id: number) => {
    setQueries(queries => queries.map(q => q.id === id ? { 
      ...q, 
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: 'Current User'
    } : q));
    setSelectedQuery(prev => prev?.id === id ? { 
      ...prev, 
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: 'Current User'
    } : prev);
  };

  // Reject query
  const handleReject = (id: number, reason?: string) => {
    setQueries(queries => queries.map(q => q.id === id ? { 
      ...q, 
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Current User',
      rejectionReason: reason || ''
    } : q));
    setSelectedQuery(prev => prev?.id === id ? { 
      ...prev, 
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Current User',
      rejectionReason: reason || ''
    } : prev);
  };

  // Withdraw consent (changes approved query to rejected)
  const handleWithdrawConsent = (id: number) => {
    setQueries(queries => queries.map(q => q.id === id ? { 
      ...q, 
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Current User (Consent Withdrawn)'
    } : q));
    setSelectedQuery(prev => prev?.id === id ? { 
      ...prev, 
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Current User (Consent Withdrawn)'
    } : prev);
  };

  // Copilot query generation
  const handleCopilotGenerate = async () => {
    if (!copilotPrompt.trim()) return;
    
    setCopilotLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get available datasets with approved columns
    const availableDatasets = datasetsWithApprovedColumns.filter(ds => 
      !props.activeCleanroom || ds.cleanroomId === props.activeCleanroom.id
    );
    
    // Build dataset context for better query generation
    const datasetContext = availableDatasets.map(ds => ({
      name: ds.name,
      provider: ds.provider,
      approvedColumns: ds.columns.filter((col: any) => col.approved),
      schema: ds.schema,
      kminFields: ds.kminFields || {}
    }));
    
    // Analyze prompt for multi-step processes
    const prompt = copilotPrompt.toLowerCase();
    const isMultiStep = prompt.includes('step') || prompt.includes('then') || prompt.includes('first') || 
                       prompt.includes('second') || prompt.includes('third') || prompt.includes('finally') ||
                       prompt.includes('next') || prompt.includes('afterwards') || prompt.includes('and then') ||
                       prompt.includes('filter') && prompt.includes('aggregate') ||
                       prompt.includes('join') && prompt.includes('summarize');
    
    let generatedSQL = '';
    let generatedSegments: Array<{
      id: string;
      startLine: number;
      endLine: number;
      name: string;
      inputKMins: Array<{ id: string; datasetName: string; value: string }>;
      outputKMinField: string;
      outputKMinValue: string;
      executionSequence: number;
    }> = [];
    
    // Generate contextual SQL based on prompt and available datasets
    if (datasetContext.length === 0) {
      generatedSQL = `-- No datasets with approved columns available for querying\n-- Please ensure datasets are published with approved columns first`;
    } else if (isMultiStep) {
      // Generate multi-segment query
      if (prompt.includes('filter') && prompt.includes('aggregate')) {
        // Two-step: Filter then Aggregate pattern
        const mainDataset = datasetContext[0];
        const dateCol = mainDataset.approvedColumns.find(col => col.name.toLowerCase().includes('date'));
        const categoryCol = mainDataset.approvedColumns.find(col => col.type === 'string' && col.name.toLowerCase().includes('category'));
        const metricCol = mainDataset.approvedColumns.find(col => col.type === 'double' || col.type === 'integer');
        
        // Step 1: Filter data
        const step1SQL = `-- Step 1: Filter and prepare data
CREATE TEMP VIEW filtered_data AS
SELECT *
FROM ${mainDataset.name}
${dateCol ? `WHERE ${dateCol.name} >= '2024-01-01'` : 'WHERE 1=1'}`;

        // Step 2: Aggregate results
        const step2SQL = `-- Step 2: Aggregate filtered data
SELECT 
    ${categoryCol?.name || mainDataset.approvedColumns[0]?.name},
    COUNT(*) as record_count${metricCol ? `,
    AVG(${metricCol.name}) as avg_${metricCol.name}` : ''}
FROM filtered_data
GROUP BY ${categoryCol?.name || mainDataset.approvedColumns[0]?.name}
HAVING COUNT(*) >= 100
ORDER BY record_count DESC`;

        generatedSQL = `${step1SQL}

${step2SQL}`;

        // Generate segments
        generatedSegments = [
          {
            id: '1',
            startLine: 1,
            endLine: step1SQL.split('\n').length,
            name: 'Data Filtering',
            inputKMins: [{
              id: '1',
              datasetName: mainDataset.name,
              value: String(Object.values(mainDataset.kminFields)[0] || '50')
            }],
            outputKMinField: '',
            outputKMinValue: '',
            executionSequence: 1
          },
          {
            id: '2',
            startLine: step1SQL.split('\n').length + 2,
            endLine: (step1SQL + '\n\n' + step2SQL).split('\n').length,
            name: 'Data Aggregation',
            inputKMins: [{
              id: '2',
              datasetName: 'filtered_data',
              value: '100'
            }],
            outputKMinField: 'record_count',
            outputKMinValue: '100',
            executionSequence: 2
          }
        ];
      } else if (prompt.includes('join') || prompt.includes('combine')) {
        // Multi-step join process
        if (datasetContext.length >= 2) {
          const dataset1 = datasetContext[0];
          const dataset2 = datasetContext[1];
          
          const joinCol1 = dataset1.approvedColumns.find(col => 
            col.name.toLowerCase().includes('id') || col.name.toLowerCase().includes('customer')
          );
          const joinCol2 = dataset2.approvedColumns.find(col => 
            col.name.toLowerCase().includes('id') || col.name.toLowerCase().includes('customer')
          );
          
          // Step 1: Prepare first dataset
          const step1SQL = `-- Step 1: Prepare ${dataset1.name} data
CREATE TEMP VIEW prepared_${dataset1.name.toLowerCase()} AS
SELECT ${joinCol1?.name || dataset1.approvedColumns[0]?.name}, 
       ${dataset1.approvedColumns.slice(1, 3).map(col => col.name).join(', ')}
FROM ${dataset1.name}
WHERE ${joinCol1?.name || dataset1.approvedColumns[0]?.name} IS NOT NULL`;

          // Step 2: Prepare second dataset  
          const step2SQL = `-- Step 2: Prepare ${dataset2.name} data
CREATE TEMP VIEW prepared_${dataset2.name.toLowerCase()} AS
SELECT ${joinCol2?.name || dataset2.approvedColumns[0]?.name},
       ${dataset2.approvedColumns.slice(1, 3).map(col => col.name).join(', ')}
FROM ${dataset2.name}
WHERE ${joinCol2?.name || dataset2.approvedColumns[0]?.name} IS NOT NULL`;

          // Step 3: Join and analyze
          const step3SQL = `-- Step 3: Join datasets and analyze
SELECT 
    p1.${joinCol1?.name || dataset1.approvedColumns[0]?.name},
    COUNT(*) as combined_records,
    COUNT(DISTINCT p1.${joinCol1?.name || dataset1.approvedColumns[0]?.name}) as unique_entities
FROM prepared_${dataset1.name.toLowerCase()} p1
JOIN prepared_${dataset2.name.toLowerCase()} p2 
  ON p1.${joinCol1?.name || dataset1.approvedColumns[0]?.name} = p2.${joinCol2?.name || dataset2.approvedColumns[0]?.name}
GROUP BY p1.${joinCol1?.name || dataset1.approvedColumns[0]?.name}
HAVING COUNT(*) >= 50
ORDER BY combined_records DESC`;

          generatedSQL = `${step1SQL}

${step2SQL}

${step3SQL}`;

          // Generate segments for 3-step process
          const step1Lines = step1SQL.split('\n').length;
          const step2Lines = step2SQL.split('\n').length;
          
          generatedSegments = [
            {
              id: '1',
              startLine: 1,
              endLine: step1Lines,
              name: `Prepare ${dataset1.name}`,
              inputKMins: [{
                id: '1',
                datasetName: dataset1.name,
                value: String(Object.values(dataset1.kminFields)[0] || '100')
              }],
              outputKMinField: '',
              outputKMinValue: '',
              executionSequence: 1
            },
            {
              id: '2', 
              startLine: step1Lines + 2,
              endLine: step1Lines + 1 + step2Lines,
              name: `Prepare ${dataset2.name}`,
              inputKMins: [{
                id: '2',
                datasetName: dataset2.name,
                value: String(Object.values(dataset2.kminFields)[0] || '100')
              }],
              outputKMinField: '',
              outputKMinValue: '',
              executionSequence: 2
            },
            {
              id: '3',
              startLine: step1Lines + step2Lines + 3,
              endLine: (step1SQL + '\n\n' + step2SQL + '\n\n' + step3SQL).split('\n').length,
              name: 'Cross-Dataset Analysis',
              inputKMins: [
                { id: '3a', datasetName: `prepared_${dataset1.name.toLowerCase()}`, value: '50' },
                { id: '3b', datasetName: `prepared_${dataset2.name.toLowerCase()}`, value: '50' }
              ],
              outputKMinField: 'combined_records',
              outputKMinValue: '50',
              executionSequence: 3
            }
          ];
        } else {
          generatedSQL = `-- Multi-step analysis requires at least 2 datasets
-- Available datasets: ${datasetContext.length}`;
        }
      } else {
        // Generic multi-step pattern based on detected keywords
        const mainDataset = datasetContext[0];
        const step1SQL = `-- Step 1: Initial data preparation
CREATE TEMP VIEW step1_data AS
SELECT *
FROM ${mainDataset.name}
WHERE ${mainDataset.approvedColumns.find(col => col.name.toLowerCase().includes('date'))?.name || mainDataset.approvedColumns[0]?.name} IS NOT NULL`;

        const step2SQL = `-- Step 2: Analysis and aggregation
SELECT 
    ${mainDataset.approvedColumns.find(col => col.type === 'string')?.name || mainDataset.approvedColumns[0]?.name},
    COUNT(*) as record_count
FROM step1_data
GROUP BY ${mainDataset.approvedColumns.find(col => col.type === 'string')?.name || mainDataset.approvedColumns[0]?.name}
HAVING COUNT(*) >= 100
ORDER BY record_count DESC`;

        generatedSQL = `${step1SQL}

${step2SQL}`;

        generatedSegments = [
          {
            id: '1',
            startLine: 1,
            endLine: step1SQL.split('\n').length,
            name: 'Data Preparation',
            inputKMins: [{
              id: '1',
              datasetName: mainDataset.name,
              value: String(Object.values(mainDataset.kminFields)[0] || '100')
            }],
            outputKMinField: '',
            outputKMinValue: '',
            executionSequence: 1
          },
          {
            id: '2',
            startLine: step1SQL.split('\n').length + 2,
            endLine: (step1SQL + '\n\n' + step2SQL).split('\n').length,
            name: 'Final Analysis',
            inputKMins: [{
              id: '2',
              datasetName: 'step1_data',
              value: '50'
            }],
            outputKMinField: 'record_count',
            outputKMinValue: '100',
            executionSequence: 2
          }
        ];
      }
    } else {
      // Generate single query (existing logic)
      if (prompt.includes('customer') || prompt.includes('user')) {
        const customerDatasets = datasetContext.filter(ds => 
          ds.approvedColumns.some(col => 
            col.name.toLowerCase().includes('customer') || 
            col.name.toLowerCase().includes('user') ||
            col.name.toLowerCase().includes('advertiser')
          )
        );
        
        if (customerDatasets.length > 0) {
          const mainDataset = customerDatasets[0];
          const customerIdCol = mainDataset.approvedColumns.find(col => 
            col.name.toLowerCase().includes('customer') || 
            col.name.toLowerCase().includes('user') ||
            col.name.toLowerCase().includes('advertiser')
          );
          const kminValue = mainDataset.kminFields[customerIdCol?.name] || 100;
          
          generatedSQL = `-- Generated by Copilot based on: "${copilotPrompt}"
-- Using dataset: ${mainDataset.name} (${mainDataset.provider})
SELECT 
    ${customerIdCol?.name || 'customer_id'},
    COUNT(*) as record_count,
    ${mainDataset.approvedColumns.find(col => col.type === 'double' || col.type === 'integer')?.name || 'metric_value'} as avg_value
FROM ${mainDataset.name}
${mainDataset.approvedColumns.some(col => col.name.toLowerCase().includes('date')) ? 
  `WHERE ${mainDataset.approvedColumns.find(col => col.name.toLowerCase().includes('date'))?.name} >= '2024-01-01'` : ''}
GROUP BY ${customerIdCol?.name || 'customer_id'}
HAVING COUNT(*) >= ${kminValue}
ORDER BY record_count DESC`;
        } else {
          generatedSQL = `-- Generated by Copilot based on: "${copilotPrompt}"
-- No customer/user datasets found. Available datasets: ${datasetContext.map(ds => ds.name).join(', ')}`;
        }
      } else if (prompt.includes('revenue') || prompt.includes('sales') || prompt.includes('transaction')) {
        const transactionDatasets = datasetContext.filter(ds => 
          ds.approvedColumns.some(col => 
            col.name.toLowerCase().includes('amount') || 
            col.name.toLowerCase().includes('revenue') ||
            col.name.toLowerCase().includes('transaction') ||
            col.name.toLowerCase().includes('purchase') ||
            col.name.toLowerCase().includes('t_val')
          )
        );
        
        if (transactionDatasets.length > 0) {
          const mainDataset = transactionDatasets[0];
          const amountCol = mainDataset.approvedColumns.find(col => 
            col.name.toLowerCase().includes('amount') || 
            col.name.toLowerCase().includes('t_val') ||
            col.name.toLowerCase().includes('revenue')
          );
          const groupByCol = mainDataset.approvedColumns.find(col => 
            col.name.toLowerCase().includes('category') ||
            col.name.toLowerCase().includes('type') ||
            col.name.toLowerCase().includes('segment')
          ) || mainDataset.approvedColumns.find(col => col.type === 'string');
          
          generatedSQL = `-- Generated by Copilot based on: "${copilotPrompt}"
-- Using dataset: ${mainDataset.name} (${mainDataset.provider})
SELECT 
    ${groupByCol?.name || 'category'},
    COUNT(*) as transaction_count,
    ${amountCol ? `SUM(${amountCol.name}) as total_revenue,
    AVG(${amountCol.name}) as avg_transaction` : 'COUNT(*) as total_transactions'}
FROM ${mainDataset.name}
${mainDataset.approvedColumns.some(col => col.name.toLowerCase().includes('date')) ? 
  `WHERE ${mainDataset.approvedColumns.find(col => col.name.toLowerCase().includes('date'))?.name} >= '2024-01-01'` : ''}
GROUP BY ${groupByCol?.name || 'category'}
HAVING COUNT(*) >= ${Object.values(mainDataset.kminFields)[0] || 100}
ORDER BY ${amountCol ? 'total_revenue' : 'transaction_count'} DESC`;
        } else {
          generatedSQL = `-- Generated by Copilot based on: "${copilotPrompt}"
-- No transaction/revenue datasets found. Available datasets: ${datasetContext.map(ds => ds.name).join(', ')}`;
        }
      } else if (prompt.includes('join') || prompt.includes('cross') || prompt.includes('combine')) {
        if (datasetContext.length >= 2) {
          const dataset1 = datasetContext[0];
          const dataset2 = datasetContext[1];
          
          const joinCol1 = dataset1.approvedColumns.find(col => 
            col.name.toLowerCase().includes('id') || 
            col.name.toLowerCase().includes('user') ||
            col.name.toLowerCase().includes('customer')
          );
          const joinCol2 = dataset2.approvedColumns.find(col => 
            col.name.toLowerCase().includes('id') ||
            col.name.toLowerCase().includes('user') ||
            col.name.toLowerCase().includes('customer')
          );
          
          generatedSQL = `-- Generated by Copilot based on: "${copilotPrompt}"
-- Cross-dataset analysis using: ${dataset1.name} (${dataset1.provider}) + ${dataset2.name} (${dataset2.provider})
SELECT 
    ${joinCol1?.name || dataset1.approvedColumns[0]?.name},
    COUNT(*) as combined_records,
    ${dataset1.approvedColumns.find(col => col.type === 'double' || col.type === 'integer')?.name || 'metric1'} as avg_metric1,
    ${dataset2.approvedColumns.find(col => col.type === 'double' || col.type === 'integer')?.name || 'metric2'} as avg_metric2
FROM ${dataset1.name} d1
JOIN ${dataset2.name} d2 ON d1.${joinCol1?.name || dataset1.approvedColumns[0]?.name} = d2.${joinCol2?.name || dataset2.approvedColumns[0]?.name}
GROUP BY ${joinCol1?.name || dataset1.approvedColumns[0]?.name}
HAVING COUNT(*) >= ${Object.values(dataset1.kminFields)[0] || 100}
ORDER BY combined_records DESC`;
        } else {
          generatedSQL = `-- Generated by Copilot based on: "${copilotPrompt}"
-- Cross-dataset analysis requires at least 2 datasets. Available: ${datasetContext.length}
-- Available datasets: ${datasetContext.map(ds => ds.name).join(', ')}`;
        }
      } else {
        const mainDataset = datasetContext[0];
        const groupByCol = mainDataset.approvedColumns.find(col => col.type === 'string');
        const metricCol = mainDataset.approvedColumns.find(col => col.type === 'double' || col.type === 'integer');
        const dateCol = mainDataset.approvedColumns.find(col => col.name.toLowerCase().includes('date'));
        
        generatedSQL = `-- Generated by Copilot based on: "${copilotPrompt}"
-- Using dataset: ${mainDataset.name} (${mainDataset.provider})
-- Available columns: ${mainDataset.approvedColumns.map(col => col.name).join(', ')}
SELECT 
    ${groupByCol?.name || mainDataset.approvedColumns[0]?.name},
    COUNT(*) as record_count${metricCol ? `,
    AVG(${metricCol.name}) as avg_${metricCol.name}` : ''}
FROM ${mainDataset.name}
${dateCol ? `WHERE ${dateCol.name} >= '2024-01-01'` : ''}
GROUP BY ${groupByCol?.name || mainDataset.approvedColumns[0]?.name}
HAVING COUNT(*) >= ${Object.values(mainDataset.kminFields)[0] || 100}
ORDER BY record_count DESC`;
      }
    }
    
    // Add dataset context comment
    if (datasetContext.length > 0) {
      generatedSQL += `

-- Available datasets and their approved columns:
${datasetContext.map(ds => 
  `-- ${ds.name} (${ds.provider}): ${ds.approvedColumns.map(col => `${col.name}(${col.type})`).join(', ')}`
).join('\n')}`;
    }
    
    // Set up generated segments if multi-step
    if (generatedSegments.length > 0) {
      setQuerySegments(generatedSegments);
    }
    
    setCopilotSuggestion(generatedSQL);
    setSql(generatedSQL);
    
    // Add to history
    const newHistoryItem = {
      id: Date.now().toString(),
      prompt: copilotPrompt,
      response: generatedSQL,
      timestamp: new Date()
    };
    setCopilotHistory(prev => [newHistoryItem, ...prev]);
    
    setCopilotLoading(false);
    setCopilotPrompt('');
  };

  // Track running query timeouts
  const [runningTimeouts, setRunningTimeouts] = useState<Map<number, number>>(new Map());

  // Date parameters for query execution
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Copilot experience state
  const [copilotPrompt, setCopilotPrompt] = useState<string>('');
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);
  const [copilotSuggestion, setCopilotSuggestion] = useState<string>('');
  const [copilotHistory, setCopilotHistory] = useState<Array<{id: string, prompt: string, response: string, timestamp: Date}>>([]);
  const [showCopilotMode, setShowCopilotMode] = useState<boolean>(false);

  // Run query
  const handleRun = (id: number, startDate?: string, endDate?: string) => {
    // Check if data sinks are configured
    if (!hasEnabledDataSinks) {
      alert('Cannot run query: No data sinks are configured. Please configure at least one data sink in the Publish Datasets section before running queries.');
      return;
    }

    const startTime = new Date();
    const runId = Date.now();
    
    // Start execution
    setQueries(queries => queries.map(q => q.id === id ? {
      ...q,
      executions: [...q.executions, {
        runId,
        startedAt: startTime.toISOString(),
        status: 'running' as const,
        queryStartDate: startDate || undefined,
        queryEndDate: endDate || undefined
      }],
      totalRuns: q.totalRuns + 1
    } : q));

    // Update selected query if it's the one being run
    setSelectedQuery(prev => prev?.id === id ? {
      ...prev,
      executions: [...prev.executions, {
        runId,
        startedAt: startTime.toISOString(),
        status: 'running' as const,
        queryStartDate: startDate || undefined,
        queryEndDate: endDate || undefined
      }],
      totalRuns: prev.totalRuns + 1
    } : prev);

    // Simulate completion after 2 seconds
    const timeoutId = setTimeout(() => {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      setQueries(queries => queries.map(q => q.id === id ? {
        ...q,
        executions: q.executions.map(exec => exec.runId === runId ? {
          ...exec,
          completedAt: endTime.toISOString(),
          status: 'completed' as const,
          duration
        } : exec)
      } : q));

      setSelectedQuery(prev => prev?.id === id ? {
        ...prev,
        executions: prev.executions.map(exec => exec.runId === runId ? {
          ...exec,
          completedAt: endTime.toISOString(),
          status: 'completed' as const,
          duration
        } : exec)
      } : prev);

      // Remove timeout from tracking
      setRunningTimeouts(prev => {
        const newMap = new Map(prev);
        newMap.delete(runId);
        return newMap;
      });
    }, 2000);

    // Store timeout for potential cancellation
    setRunningTimeouts(prev => new Map(prev.set(runId, timeoutId)));
  };

  // Stop query execution
  const handleStop = (id: number) => {
    const stopTime = new Date();
    
    // Find the running execution
    const query = queries.find(q => q.id === id);
    const runningExecution = query?.executions.find(exec => exec.status === 'running');
    
    if (!runningExecution) return;

    // Clear the timeout if it exists
    const timeoutId = runningTimeouts.get(runningExecution.runId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setRunningTimeouts(prev => {
        const newMap = new Map(prev);
        newMap.delete(runningExecution.runId);
        return newMap;
      });
    }
    
    // Update execution status to stopped
    setQueries(queries => queries.map(q => q.id === id ? {
      ...q,
      executions: q.executions.map(exec => exec.runId === runningExecution.runId ? {
        ...exec,
        completedAt: stopTime.toISOString(),
        status: 'stopped' as const,
        duration: stopTime.getTime() - new Date(exec.startedAt).getTime()
      } : exec)
    } : q));

    setSelectedQuery(prev => prev?.id === id ? {
      ...prev,
      executions: prev.executions.map(exec => exec.runId === runningExecution.runId ? {
        ...exec,
        completedAt: stopTime.toISOString(),
        status: 'stopped' as const,
        duration: stopTime.getTime() - new Date(exec.startedAt).getTime()
      } : exec)
    } : prev);
  };

  return (
    <div style={{ 
      backgroundColor: '#faf9f8', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e1dfdd',
        padding: '40px 0',
        position: 'relative',
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 48px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 600, 
              margin: '0 0 12px 0',
              color: '#323130',
              letterSpacing: '-0.5px'
            }}>
              Queries
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#605e5c', 
              margin: '0 0 32px 0',
              lineHeight: '24px'
            }}>
              Create Spark SQL queries to analyze collaborative datasets and submit for approval
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', maxWidth: '600px' }}>
            <button
              onClick={() => setTab('create')}
              style={{
                padding: '16px 32px',
                backgroundColor: tab === 'create' ? '#0078d4' : '#ffffff',
                color: tab === 'create' ? '#ffffff' : '#323130',
                border: tab === 'create' ? '1px solid #0078d4' : '1px solid #e1dfdd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: tab === 'create' ? '0 2px 8px rgba(0, 120, 212, 0.25)' : '0 2px 4px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '160px',
                justifyContent: 'center'
              }}
            >
              <span>➕</span>
              Create Query
            </button>
            <button
              onClick={() => setTab('list')}
              style={{
                padding: '16px 32px',
                backgroundColor: tab === 'list' ? '#0078d4' : '#ffffff',
                color: tab === 'list' ? '#ffffff' : '#323130',
                border: tab === 'list' ? '1px solid #0078d4' : '1px solid #e1dfdd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: tab === 'list' ? '0 2px 8px rgba(0, 120, 212, 0.25)' : '0 2px 4px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '160px',
                justifyContent: 'center'
              }}
            >
              <span>📋</span>
              View Queries
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ 
        flex: 1,
        padding: '0 16px',
        paddingTop: '40px',
        paddingBottom: '40px'
      }}>
        {/* Pending Queries Notification */}
        {getPendingQueries().length > 0 && (
          <div style={{
            backgroundColor: '#fff8e1',
            border: '1px solid #ffcc02',
            borderRadius: '12px',
            padding: '24px 32px',
            marginBottom: '32px',
            maxWidth: '100%',
            margin: '0 auto 32px auto',
            boxShadow: '0 2px 8px rgba(255, 204, 2, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#ffcc02',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0
              }}>
                ⏳
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 600, 
                  color: '#8a6d00', 
                  marginBottom: '8px',
                  fontSize: '17px'
                }}>
                  {getPendingQueries().length} {getPendingQueries().length === 1 ? 'Query' : 'Queries'} Pending Approval
                </div>
                <div style={{ 
                  color: '#8a6d00', 
                  fontSize: '15px',
                  lineHeight: '22px'
                }}>
                  {getPendingQueries().length === 1 ? 'Your query has' : 'Your queries have'} been submitted and {getPendingQueries().length === 1 ? 'is' : 'are'} waiting for approval from the dataset owners.
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'create' ? (
          // AWS Clean Rooms Style UI with Original Functionality
          <div 
            style={{ 
              display: 'flex', 
              flex: 1,
              maxWidth: '100%',
              margin: '0 auto',
              width: '100%',
              gap: '24px'
            }}

          >
          {/* Left Panel - Tables Schema */}
          <div style={{
            width: '220px',
            backgroundColor: '#2f3349',
            color: '#ffffff',
            padding: '0',
            overflowY: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Tables Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #444966',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: 'transparent',
                border: '2px solid #ffffff',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>⚏</span>
              </div>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                margin: 0,
                color: '#ffffff'
              }}>
                Tables
              </h2>
              <button style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
              }}>
                🔄
              </button>
            </div>

            {/* Dataset/Table List */}
            <div style={{ padding: '16px 0' }}>
              {!hasMultipleProviders ? (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: '#a0a8c1',
                  fontSize: '14px'
                }}>
                  Query creation requires datasets from at least 2 different providers with approved columns.
                </div>
              ) : (
                props.datasets.filter(ds => ds.columns.some((col: any) => col.approved)).map(dataset => {
                  const tableKey = `${dataset.name}-table`;
                  const isExpanded = expandedTables[tableKey];
                  return (
                    <div key={dataset.name} style={{ marginBottom: '8px' }}>
                      {/* Table Header */}
                      <div
                        onClick={() => setExpandedTables(prev => ({
                          ...prev,
                          [tableKey]: !prev[tableKey]
                        }))}
                        style={{
                          padding: '12px 20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: isExpanded ? '#444966' : 'transparent',
                          borderLeft: isExpanded ? '3px solid #0078d4' : '3px solid transparent'
                        }}
                      >
                        <span style={{ fontSize: '12px', color: '#a0a8c1' }}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                        <div style={{ 
                          width: '16px', 
                          height: '16px',
                          backgroundColor: '#0078d4',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '10px', color: '#ffffff' }}>📊</span>
                        </div>
                        <div>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: 500,
                            color: '#ffffff'
                          }}>
                            {dataset.name}
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: '#a0a8c1',
                            marginTop: '2px'
                          }}>
                            table | {dataset.provider} | Azure | {dataset.columns.filter((col: any) => col.approved).length} columns
                          </div>
                        </div>
                      </div>

                      {/* Table Columns */}
                      {isExpanded && (
                        <div style={{ paddingLeft: '40px', paddingRight: '20px' }}>
                          <div style={{
                            padding: '12px 0 8px 0',
                            borderBottom: '1px solid #444966',
                            marginBottom: '8px'
                          }}>
                            <div style={{ 
                              fontSize: '12px', 
                              fontWeight: 600, 
                              color: '#a0a8c1',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Available Columns
                            </div>
                          </div>
                          
                          {dataset.columns.filter((col: any) => col.approved).map((col: any) => (
                            <div
                              key={col.name}
                              style={{
                                padding: '8px 12px',
                                margin: '4px 0',
                                backgroundColor: 'transparent',
                                border: '1px solid transparent',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <div style={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: col.type === 'string' ? '#9333ea' : col.type.includes('int') ? '#0ea5e9' : '#f59e0b',
                                borderRadius: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <span style={{ 
                                  fontSize: '10px', 
                                  color: '#ffffff',
                                  fontWeight: 'bold'
                                }}>
                                  {col.type === 'string' ? 'T' : col.type.includes('int') ? '#' : 'N'}
                                </span>
                              </div>
                              <div>
                                <div style={{ 
                                  fontSize: '13px', 
                                  color: '#ffffff',
                                  fontWeight: 500
                                }}>
                                  {col.name}
                                </div>
                                <div style={{ 
                                  fontSize: '11px', 
                                  color: '#a0a8c1'
                                }}>
                                  {col.type} {col.kmin ? `| k-min: ${col.kmin}` : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel - Query Builder with Original Functionality */}
          <div style={{ 
            flex: 1,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Create Query Header */}
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e1dfdd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa',
              borderRadius: '0 8px 0 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'transparent',
                  border: '2px solid #232323',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>📊</span>
                </div>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  margin: 0,
                  color: '#323130'
                }}>
                  Create Query
                </h2>
              </div>
              <button
                onClick={() => setShowCopilotMode(!showCopilotMode)}
                style={{
                  padding: '10px 18px',
                  backgroundColor: showCopilotMode ? '#0078d4' : '#ffffff',
                  color: showCopilotMode ? '#ffffff' : '#323130',
                  border: '1px solid #0078d4',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                  <defs>
                    <linearGradient id="copilotGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B35" />
                      <stop offset="25%" stopColor="#F7931E" />
                      <stop offset="50%" stopColor="#FFD23F" />
                      <stop offset="75%" stopColor="#06FFA5" />
                      <stop offset="100%" stopColor="#4ECDC4" />
                    </linearGradient>
                    <linearGradient id="copilotGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#667EEA" />
                      <stop offset="50%" stopColor="#764BA2" />
                      <stop offset="100%" stopColor="#F093FB" />
                    </linearGradient>
                  </defs>
                  <circle cx="4" cy="4" r="1.5" fill="url(#copilotGradient1)" opacity="0.8" />
                  <circle cx="12" cy="4" r="1.5" fill="url(#copilotGradient2)" opacity="0.8" />
                  <circle cx="8" cy="8" r="2" fill="url(#copilotGradient1)" opacity="0.9" />
                  <circle cx="4" cy="12" r="1.5" fill="url(#copilotGradient2)" opacity="0.8" />
                  <circle cx="12" cy="12" r="1.5" fill="url(#copilotGradient1)" opacity="0.8" />
                  <path d="M6 6l4 4M10 6l-4 4" stroke="url(#copilotGradient2)" strokeWidth="1" opacity="0.6" />
                </svg>
                {showCopilotMode ? 'Exit Copilot' : 'Use Copilot'}
              </button>
            </div>

            {!hasMultipleProviders ? (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                color: '#a4262c',
                fontSize: '16px'
              }}>
                Query creation requires datasets from at least 2 different providers with approved columns. Current providers: {uniqueProviders.length > 0 ? uniqueProviders.join(', ') : 'None'}
              </div>
            ) : (
              <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
                {/* Copilot Mode Interface */}
                {showCopilotMode && (
                  <div style={{
                    backgroundColor: '#f0f8ff',
                    border: '1px solid #0078d4',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '20px' }}>🤖</span>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0078d4' }}>
                        Copilot Query Assistant
                      </h3>
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#323130' }}>
                        Describe what you want to analyze:
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <textarea
                          value={copilotPrompt}
                          onChange={(e) => setCopilotPrompt(e.target.value)}
                          placeholder="e.g., 'Show me customer revenue analysis by segment' or 'Find top selling products by category'"
                          style={{
                            flex: 1,
                            height: '80px',
                            padding: '12px 16px',
                            border: '1px solid #e1dfdd',
                            borderRadius: '8px',
                            fontSize: '14px',
                            resize: 'vertical',
                            outline: 'none'
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey && !copilotLoading) {
                              handleCopilotGenerate();
                            }
                          }}
                        />
                        <button
                          onClick={handleCopilotGenerate}
                          disabled={copilotLoading || !copilotPrompt.trim()}
                          style={{
                            padding: '12px 20px',
                            backgroundColor: copilotLoading ? '#f3f2f1' : '#0078d4',
                            color: copilotLoading ? '#a19f9d' : '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: copilotLoading ? 'not-allowed' : 'pointer',
                            minWidth: '120px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          {copilotLoading ? (
                            <>
                              <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #a19f9d',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <span>✨</span>
                              Generate
                            </>
                          )}
                        </button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#605e5c', marginTop: '4px' }}>
                        Press Ctrl+Enter to generate query
                      </div>
                    </div>

                    {/* Copilot History */}
                    {copilotHistory.length > 0 && (
                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e1dfdd',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px'
                      }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#323130' }}>
                          Recent Generations
                        </h4>
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {copilotHistory.slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSql(item.response);
                                setCopilotSuggestion(item.response);
                              }}
                              style={{
                                padding: '8px 12px',
                                marginBottom: '8px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e1dfdd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#e8f5e8';
                                e.currentTarget.style.borderColor = '#107c10';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.borderColor = '#e1dfdd';
                              }}
                            >
                              <div style={{ fontSize: '13px', fontWeight: 500, color: '#323130', marginBottom: '2px' }}>
                                "{item.prompt}"
                              </div>
                              <div style={{ fontSize: '11px', color: '#605e5c' }}>
                                {item.timestamp.toLocaleTimeString()} • Click to use
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Suggestions */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e1dfdd',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#323130' }}>
                        Quick Suggestions (Based on Your Data)
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                        {(() => {
                          const suggestions = [];
                          const availableDatasets = datasetsWithApprovedColumns;
                          
                          // Generate dataset-specific suggestions
                          availableDatasets.forEach(ds => {
                            const hasCustomerData = ds.columns.some((col: any) => 
                              col.approved && (col.name.toLowerCase().includes('customer') || 
                              col.name.toLowerCase().includes('user') || col.name.toLowerCase().includes('advertiser'))
                            );
                            const hasAmountData = ds.columns.some((col: any) => 
                              col.approved && (col.name.toLowerCase().includes('amount') || 
                              col.name.toLowerCase().includes('revenue') || col.name.toLowerCase().includes('t_val'))
                            );
                            const hasCategoryData = ds.columns.some((col: any) => 
                              col.approved && col.name.toLowerCase().includes('category')
                            );
                            
                            if (hasCustomerData && hasAmountData) {
                              suggestions.push(`Analyze ${ds.name} revenue by customer segments`);
                              // Add multi-step suggestion
                              suggestions.push(`First filter ${ds.name} customers, then calculate their total revenue`);
                            }
                            if (hasCategoryData) {
                              suggestions.push(`Compare ${ds.name} performance across categories`);
                            }
                            if (ds.columns.some((col: any) => col.approved && col.name.toLowerCase().includes('date'))) {
                              suggestions.push(`Trend analysis for ${ds.name} over time`);
                            }
                          });
                          
                          // Add cross-dataset multi-step suggestions if multiple datasets
                          if (availableDatasets.length >= 2) {
                            suggestions.push(`Join ${availableDatasets[0].name} and ${availableDatasets[1].name} for cross-analysis`);
                            suggestions.push(`First prepare ${availableDatasets[0].name} data, then combine with ${availableDatasets[1].name}`);
                          }
                          
                          // Add generic multi-step patterns
                          if (availableDatasets.length > 0) {
                            suggestions.push(`Filter data first, then aggregate by key metrics`);
                            suggestions.push(`Step 1: Clean data, Step 2: Group and summarize`);
                          }
                          
                          // Fallback suggestions if no specific patterns found
                          if (suggestions.length === 0 && availableDatasets.length > 0) {
                            suggestions.push(`Summarize ${availableDatasets[0].name} data patterns`);
                            suggestions.push(`Group ${availableDatasets[0].name} by key dimensions`);
                          }
                          
                          return suggestions.slice(0, 6).map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => setCopilotPrompt(suggestion)}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e1dfdd',
                                borderRadius: '6px',
                                fontSize: '12px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f0f8ff';
                                e.currentTarget.style.borderColor = '#0078d4';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.borderColor = '#e1dfdd';
                              }}
                            >
                              {suggestion}
                            </button>
                          ));
                        })()}
                      </div>
                      {datasetsWithApprovedColumns.length === 0 && (
                        <div style={{ fontSize: '12px', color: '#605e5c', fontStyle: 'italic', marginTop: '8px' }}>
                          No datasets with approved columns available. Publish datasets first to see relevant suggestions.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Input Datasets Selection */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    margin: '0 0 16px 0',
                    color: '#323130'
                  }}>
                    Input Datasets
                  </h3>
                  <div style={{ 
                    border: '1px solid #e1dfdd', 
                    borderRadius: '8px', 
                    padding: '20px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    {props.datasets.filter(ds => ds.columns.some((col: any) => col.approved)).map(dataset => (
                      <div key={dataset.name} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '12px',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: selectedInputDatasets.includes(dataset.name) ? '#e8f5e8' : 'transparent'
                      }}>
                        <input
                          type="checkbox"
                          id={`dataset-${dataset.name}`}
                          checked={selectedInputDatasets.includes(dataset.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInputDatasets([...selectedInputDatasets, dataset.name]);
                            } else {
                              setSelectedInputDatasets(selectedInputDatasets.filter(name => name !== dataset.name));
                            }
                          }}
                          style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                        />
                        <label htmlFor={`dataset-${dataset.name}`} style={{ 
                          fontSize: '14px', 
                          cursor: 'pointer',
                          fontWeight: 500
                        }}>
                          {dataset.name} ({dataset.provider}) - {dataset.columns.filter((col: any) => col.approved).length} approved columns
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SQL Query Editor */}
                <>
                    {/* Query Description */}
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: 600, 
                        margin: '0 0 16px 0',
                        color: '#323130'
                      }}>
                        Query Description (Optional)
                      </h3>
                      <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        style={{
                          width: '100%',
                          height: '80px',
                          backgroundColor: '#ffffff',
                          color: '#323130',
                          border: '1px solid #e1dfdd',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                          fontSize: '14px',
                          resize: 'vertical',
                          outline: 'none',
                          lineHeight: '1.5'
                        }}
                        placeholder="Describe the purpose and goals of this query (optional)..."
                      />
                    </div>

                    {/* SQL Query */}
                    <div style={{ marginBottom: '32px' }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: 600, 
                        margin: '0 0 16px 0',
                        color: '#323130'
                      }}>
                        SQL Query
                      </h3>
                      <div style={{
                        backgroundColor: '#1e1e1e',
                        border: '1px solid #3c3c3c',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}>
                        {/* Editor Header */}
                        <div style={{
                          backgroundColor: '#2d2d30',
                          borderBottom: '1px solid #3c3c3c',
                          padding: '8px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#ff5f56'
                          }}></div>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#ffbd2e'
                          }}></div>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#27ca3f'
                          }}></div>
                          <div style={{
                            marginLeft: '12px',
                            fontSize: '13px',
                            color: '#cccccc',
                            fontFamily: '"Consolas", "Monaco", "Courier New", monospace'
                          }}>
                            query.sql
                          </div>
                        </div>
                        
                        {/* Line Numbers and Editor */}
                        <div 
                          style={{ display: 'flex', position: 'relative' }}
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          {/* Line Numbers */}
                          <div 
                            ref={lineNumbersRef}
                            style={{
                              backgroundColor: '#1e1e1e',
                              borderRight: '1px solid #3c3c3c',
                              padding: '20px 8px',
                              fontSize: '14px',
                              fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
                              color: '#858585',
                              lineHeight: '1.6',
                              minWidth: '40px',
                              textAlign: 'right',
                              userSelect: 'none',
                              height: '240px',
                              overflow: 'hidden',
                              boxSizing: 'border-box'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {(sql || '\n').split('\n').map((_, index) => {
                              const lineNumber = index + 1;
                              const segment = getSegmentForLine(lineNumber);
                              const isSegmentStart = segment && segment.startLine === lineNumber;
                              return (
                                <div 
                                  key={index} 
                                  style={{ 
                                    height: '22.4px',
                                    backgroundColor: segment ? '#2d2d30' : 'transparent',
                                    color: segment ? '#4fc3f7' : '#858585',
                                    cursor: 'context-menu',
                                    position: 'relative',
                                    borderLeft: isSegmentStart ? '3px solid #0078d4' : 'none',
                                    paddingLeft: isSegmentStart ? '5px' : '8px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Custom context menu triggered on line', lineNumber);
                                    handleLineRightClick(e, lineNumber);
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Line number clicked:', lineNumber);
                                  }}
                                  onMouseDown={(e) => {
                                    console.log('Mouse down on line:', lineNumber, 'button:', e.button);
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = segment ? '#404040' : '#333333';
                                    e.currentTarget.style.borderLeft = '2px solid #0078d4';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = segment ? '#2d2d30' : 'transparent';
                                    e.currentTarget.style.borderLeft = isSegmentStart ? '3px solid #0078d4' : 'none';
                                  }}
                                >
                                  {lineNumber}
                                  {isSegmentStart && (
                                    <div style={{
                                      position: 'absolute',
                                      left: '-2px',
                                      top: '0',
                                      fontSize: '10px',
                                      color: '#0078d4',
                                      fontWeight: 'bold'
                                    }}>
                                      ⬤
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Code Editor */}
                          <textarea
                            ref={textareaRef}
                            value={sql}
                            onChange={e => setSql(e.target.value)}
                            onScroll={handleTextareaScroll}
                            onContextMenu={(e) => e.preventDefault()}
                            style={{
                              flex: 1,
                              height: '240px',
                              backgroundColor: 'transparent',
                              color: '#d4d4d4',
                              border: 'none',
                              padding: '20px',
                              fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
                              fontSize: '14px',
                              resize: 'none',
                              outline: 'none',
                              lineHeight: '1.6',
                              whiteSpace: 'pre',
                              overflowWrap: 'normal',
                              tabSize: 2
                            }}
                            placeholder="-- Write your Spark SQL query here
SELECT 
    column1,
    column2,
    COUNT(*) as record_count
FROM 
    your_table
WHERE 
    condition = 'value'
GROUP BY 
    column1, column2
HAVING 
    COUNT(*) >= 100"
                            spellCheck={false}
                          />
                        </div>
                        
                        {/* Status Bar */}
                        <div style={{
                          backgroundColor: '#007acc',
                          borderTop: '1px solid #3c3c3c',
                          padding: '4px 16px',
                          fontSize: '12px',
                          color: '#ffffff',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <span>Spark SQL</span>
                            <span>UTF-8</span>
                          </div>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <span>Ln {sql.split('\n').length}, Col {sql.length - sql.lastIndexOf('\n')}</span>
                            <span>{sql.split('\n').length} lines</span>
                          </div>
                        </div>
                        
                        {/* Segment Instructions */}
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e1dfdd',
                          borderRadius: '6px',
                          padding: '12px 16px',
                          marginTop: '0px',
                          fontSize: '14px',
                          color: '#605e5c',
                          lineHeight: '1.5'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                          }}>
                            <span style={{ fontSize: '16px' }}>💡</span>
                            <strong style={{ color: '#323130', fontSize: '14px' }}>Creating Query Segments:</strong>
                          </div>
                          <div style={{ paddingLeft: '24px' }}>
                            <div style={{ marginBottom: '6px' }}>
                              • <strong>Right-click on any line number</strong> to create a segment of all lines before this
                            </div>
                            <div style={{ marginBottom: '6px' }}>
                              • Each segment can have <strong>an input threshold value for each input data set (one or more)</strong> referenced in that segment
                            </div>
                            <div style={{ marginBottom: '6px' }}>
                              • Configure <strong>one output filter field and value</strong> per segment
                            </div>
                            <div style={{ marginBottom: '6px' }}>
                              • Set <strong>execution sequence</strong> (defaults to 1)
                            </div>
                            <div style={{ 
                              backgroundColor: '#fff3cd', 
                              border: '1px solid #ffeaa7', 
                              borderRadius: '4px', 
                              padding: '8px', 
                              marginTop: '8px',
                              fontSize: '13px'
                            }}>
                              <strong>Tip:</strong> For a single segment containing the entire query, right-click on the <strong>last line</strong> of your query.
                            </div>
                          </div>
                        </div>
                        
                        {/* Context Menu */}
                        {contextMenu.visible && (
                          <div
                            data-context-menu
                            style={{
                              position: 'fixed',
                              left: contextMenu.x,
                              top: contextMenu.y,
                              backgroundColor: '#2d2d30',
                              border: '1px solid #3c3c3c',
                              borderRadius: '4px',
                              padding: '4px 0',
                              zIndex: 1000,
                              minWidth: '150px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onClick={() => handleContextMenuAction('create-segment')}
                              style={{
                                padding: '8px 12px',
                                color: '#d4d4d4',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#383838'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              🔗 Create Segment from Line {contextMenu.lineNumber}
                            </div>
                          </div>
                        )}
                        
                        {/* Segment Dialog */}
                        {showSegmentDialog && selectedLineForSegment && (
                          <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1001
                          }}>
                            <div style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                              padding: '24px',
                              width: '500px',
                              maxHeight: '80vh',
                              overflow: 'auto'
                            }}>
                              <h3 style={{ margin: '0 0 20px 0', color: '#323130' }}>
                                Create Segment for Line {selectedLineForSegment}
                              </h3>
                              
                              <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, color: '#323130' }}>
                                  View Name:
                                </label>
                                <input
                                  type="text"
                                  defaultValue={`Segment ${querySegments.length + 1}`}
                                  id="segment-name"
                                  style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #e1dfdd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                              
                              {/* Input Threshold Section */}
                              <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#323130' }}>
                                  Input Threshold:
                                </label>
                                <div id="input-kmins-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                      type="text"
                                      placeholder="View name (e.g., view_a)"
                                      style={{
                                        flex: 1,
                                        padding: '6px 8px',
                                        border: '1px solid #e1dfdd',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                      }}
                                      className="input-kmin-dataset"
                                    />
                                    <input
                                      type="number"
                                      placeholder="Value"
                                      style={{
                                        width: '80px',
                                        padding: '6px 8px',
                                        border: '1px solid #e1dfdd',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                      }}
                                      className="input-kmin-value"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const container = document.getElementById('input-kmins-container');
                                        if (container) {
                                          const newRow = document.createElement('div');
                                          newRow.style.display = 'flex';
                                          newRow.style.gap = '8px';
                                          newRow.style.alignItems = 'center';
                                          newRow.innerHTML = `
                                            <input type="text" placeholder="View name" class="input-kmin-dataset" style="flex: 1; padding: 6px 8px; border: 1px solid #e1dfdd; border-radius: 4px; fontSize: 12px;" />
                                            <input type="number" placeholder="Value" class="input-kmin-value" style="width: 80px; padding: 6px 8px; border: 1px solid #e1dfdd; border-radius: 4px; fontSize: 12px;" />
                                            <button type="button" onclick="this.parentElement.remove()" style="padding: 4px 8px; background: #a4262c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">×</button>
                                          `;
                                          container.appendChild(newRow);
                                        }
                                      }}
                                      style={{
                                        padding: '4px 8px',
                                        backgroundColor: '#0078d4',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Output Filter Section */}
                              <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#323130' }}>
                                  Output Filter:
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                      type="text"
                                      id="output-field"
                                      placeholder="Field name (e.g., count, user_count)"
                                      style={{
                                        flex: 1,
                                        padding: '6px 8px',
                                        border: '1px solid #e1dfdd',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                      }}
                                    />
                                    <input
                                      type="number"
                                      id="output-value"
                                      placeholder="Value"
                                      style={{
                                        width: '80px',
                                        padding: '6px 8px',
                                        border: '1px solid #e1dfdd',
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, color: '#323130' }}>
                                  Execution Sequence:
                                </label>
                                <input
                                  type="number"
                                  id="execution-sequence"
                                  defaultValue={querySegments.length + 1}
                                  min="1"
                                  style={{
                                    width: '100px',
                                    padding: '8px 12px',
                                    border: '1px solid #e1dfdd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                              
                              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => {
                                    setShowSegmentDialog(false);
                                    setSelectedLineForSegment(null);
                                  }}
                                  style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'transparent',
                                    color: '#323130',
                                    border: '1px solid #e1dfdd',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    const name = (document.getElementById('segment-name') as HTMLInputElement)?.value || `Segment ${querySegments.length + 1}`;
                                    const sequence = parseInt((document.getElementById('execution-sequence') as HTMLInputElement)?.value || '1');
                                    
                                    // Collect input thresholds
                                    const datasetInputs = document.querySelectorAll('.input-kmin-dataset') as NodeListOf<HTMLInputElement>;
                                    const inputValueInputs = document.querySelectorAll('.input-kmin-value') as NodeListOf<HTMLInputElement>;
                                    const inputKMins = [];
                                    
                                    for (let i = 0; i < datasetInputs.length; i++) {
                                      const dataset = datasetInputs[i].value.trim();
                                      const value = inputValueInputs[i].value.trim();
                                      if (dataset && value) {
                                        inputKMins.push({
                                          id: `${Date.now()}_${i}`,
                                          datasetName: dataset,
                                          value: value
                                        });
                                      }
                                    }
                                    
                                    // Get output filter values
                                    const outputField = (document.getElementById('output-field') as HTMLInputElement)?.value || '';
                                    const outputValue = (document.getElementById('output-value') as HTMLInputElement)?.value || '';
                                    
                                    const newSegment = {
                                      id: Date.now().toString(),
                                      startLine: selectedLineForSegment,
                                      endLine: selectedLineForSegment,
                                      name,
                                      inputKMins: inputKMins,
                                      outputKMinField: outputField,
                                      outputKMinValue: outputValue,
                                      executionSequence: sequence
                                    };
                                    setQuerySegments([...querySegments, newSegment]);
                                    setShowSegmentDialog(false);
                                    setSelectedLineForSegment(null);
                                  }}
                                  style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#0078d4',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Create Segment
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Status Bar */}
                        <div style={{
                          backgroundColor: '#007acc',
                          borderTop: '1px solid #3c3c3c',
                          padding: '4px 16px',
                          fontSize: '12px',
                          color: '#ffffff',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <span>Spark SQL</span>
                            <span>UTF-8</span>
                          </div>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <span>Ln {sql.split('\n').length}, Col {sql.length - sql.lastIndexOf('\n')}</span>
                            <span>{sql.split('\n').length} lines</span>
                          </div>
                        </div>
                        
                        {/* Segment Information Display */}
                        {querySegments.length > 0 && (
                          <div style={{
                            marginTop: '16px',
                            border: '1px solid #e1dfdd',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff'
                          }}>
                            <div style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #e1dfdd',
                              backgroundColor: '#f8f9fa'
                            }}>
                              <h4 style={{
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#323130'
                              }}>
                                Query Segments ({querySegments.length})
                              </h4>
                            </div>
                            <div style={{ padding: '16px' }}>
                              {querySegments
                                .sort((a, b) => a.executionSequence - b.executionSequence)
                                .map((segment, index) => (
                                <div key={segment.id} style={{
                                  marginBottom: index < querySegments.length - 1 ? '16px' : '0',
                                  position: 'relative',
                                  border: expandedSegments[segment.id] ? '2px solid #0078d4' : '1px solid transparent',
                                  borderRadius: '6px',
                                  padding: expandedSegments[segment.id] ? '12px' : '8px',
                                  backgroundColor: expandedSegments[segment.id] ? '#f8f9fa' : 'transparent',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => toggleSegmentExpansion(segment.id)}
                                onMouseEnter={(e) => {
                                  if (!expandedSegments[segment.id]) {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!expandedSegments[segment.id]) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: expandedSegments[segment.id] ? '12px' : '8px'
                                  }}>
                                    <div style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      backgroundColor: '#0078d4',
                                      color: '#ffffff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '12px',
                                      fontWeight: 600
                                    }}>
                                      {segment.executionSequence}
                                    </div>
                                    <strong style={{ color: '#323130' }}>{segment.name}</strong>
                                    <span style={{
                                      fontSize: '12px',
                                      color: '#605e5c',
                                      backgroundColor: '#f3f2f1',
                                      padding: '2px 6px',
                                      borderRadius: '3px'
                                    }}>
                                      Line {segment.startLine}
                                    </span>
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <button
                                        onClick={(e) => removeSegment(segment.id, e)}
                                        style={{
                                          background: 'none',
                                          border: '1px solid #d13438',
                                          color: '#d13438',
                                          cursor: 'pointer',
                                          fontSize: '11px',
                                          padding: '3px 8px',
                                          borderRadius: '3px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          transition: 'all 0.2s ease',
                                          fontWeight: '500'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = '#d13438';
                                          e.currentTarget.style.color = '#ffffff';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = 'transparent';
                                          e.currentTarget.style.color = '#d13438';
                                        }}
                                        title="Remove segment"
                                      >
                                        Remove
                                      </button>
                                      <div style={{
                                        fontSize: '12px',
                                        color: '#605e5c',
                                        transform: expandedSegments[segment.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                      }}>
                                        ▼
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {expandedSegments[segment.id] && (
                                    <div style={{
                                      paddingLeft: '28px',
                                      borderTop: '1px solid #e1dfdd',
                                      paddingTop: '12px'
                                    }}>
                                      {/* Execution Sequence */}
                                      <div style={{
                                        marginBottom: '12px',
                                        padding: '8px 12px',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '4px',
                                        border: '1px solid #e1dfdd'
                                      }}>
                                        <div style={{
                                          fontSize: '12px',
                                          color: '#605e5c',
                                          marginBottom: '4px',
                                          fontWeight: 600
                                        }}>
                                          🔢 Execution Sequence
                                        </div>
                                        <div style={{
                                          fontSize: '14px',
                                          color: '#323130',
                                          fontWeight: 600
                                        }}>
                                          #{segment.executionSequence}
                                        </div>
                                      </div>

                                      {/* Input K-mins */}
                                      {segment.inputKMins.length > 0 && (
                                        <div style={{
                                          marginBottom: '12px',
                                          padding: '8px 12px',
                                          backgroundColor: '#ffffff',
                                          borderRadius: '4px',
                                          border: '1px solid #e1dfdd'
                                        }}>
                                          <div style={{
                                            fontSize: '12px',
                                            color: '#605e5c',
                                            marginBottom: '8px',
                                            fontWeight: 600
                                          }}>
                                            📊 Input Thresholds ({segment.inputKMins.length})
                                          </div>
                                          {segment.inputKMins.map((inputKMin, idx) => (
                                            <div key={inputKMin.id} style={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              alignItems: 'center',
                                              padding: '4px 8px',
                                              backgroundColor: '#f8f9fa',
                                              borderRadius: '3px',
                                              marginBottom: idx < segment.inputKMins.length - 1 ? '4px' : '0'
                                            }}>
                                              <span style={{ fontSize: '13px', color: '#323130', fontWeight: 500 }}>
                                                {inputKMin.datasetName}
                                              </span>
                                              <span style={{ fontSize: '13px', color: '#0078d4', fontWeight: 600 }}>
                                                = {inputKMin.value}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* Output K-min */}
                                      {segment.outputKMinField && segment.outputKMinValue && (
                                        <div style={{
                                          marginBottom: '12px',
                                          padding: '8px 12px',
                                          backgroundColor: '#ffffff',
                                          borderRadius: '4px',
                                          border: '1px solid #e1dfdd'
                                        }}>
                                          <div style={{
                                            fontSize: '12px',
                                            color: '#605e5c',
                                            marginBottom: '8px',
                                            fontWeight: 600
                                          }}>
                                            📈 Output Filter Configuration
                                          </div>
                                          <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '4px 8px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '3px'
                                          }}>
                                            <span style={{ fontSize: '13px', color: '#323130', fontWeight: 500 }}>
                                              {segment.outputKMinField}
                                            </span>
                                            <span style={{ fontSize: '13px', color: '#107c10', fontWeight: 600 }}>
                                              ≥ {segment.outputKMinValue}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {!expandedSegments[segment.id] && (
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#605e5c',
                                      marginLeft: '28px',
                                      lineHeight: '1.4',
                                      opacity: 0.8
                                    }}>
                                      Click to view details ({segment.inputKMins.length} input thresholds{segment.outputKMinField && segment.outputKMinValue ? ', output filter' : ''})
                                    </div>
                                  )}
                                  
                                  {/* Connecting Line */}
                                  {index < querySegments.length - 1 && (
                                    <div style={{
                                      position: 'absolute',
                                      left: '10px',
                                      bottom: '-16px',
                                      width: '1px',
                                      height: '16px',
                                      backgroundColor: '#e1dfdd',
                                      zIndex: 1
                                    }} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>




                  </>

                {/* Results Locations */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    margin: '0 0 12px 0',
                    color: '#323130'
                  }}>
                    Results Locations
                  </h3>
                  <div style={{ 
                    border: '1px solid #e1dfdd', 
                    borderRadius: '6px', 
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    minHeight: '80px'
                  }}>
                    {props.dataSinks.filter(sink => sink.enabled).length === 0 ? (
                      <div style={{ 
                        textAlign: 'center', 
                        color: '#a19f9d', 
                        fontSize: '14px',
                        fontStyle: 'italic',
                        padding: '20px'
                      }}>
                        No enabled result locations available. Configure data sinks in Publish Datasets first.
                      </div>
                    ) : (
                      props.dataSinks.filter(sink => sink.enabled).map(sink => (
                        <div key={sink.id} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          marginBottom: '12px',
                          padding: '8px',
                          borderRadius: '4px',
                          backgroundColor: resultsLocations.includes(sink.id) ? '#e8f5e8' : 'transparent'
                        }}>
                          <input
                            type="checkbox"
                            id={`sink-${sink.id}`}
                            checked={resultsLocations.includes(sink.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setResultsLocations([...resultsLocations, sink.id]);
                              } else {
                                setResultsLocations(resultsLocations.filter(id => id !== sink.id));
                              }
                            }}
                            style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                          />
                          <label htmlFor={`sink-${sink.id}`} style={{ 
                            fontSize: '14px', 
                            cursor: 'pointer',
                            fontWeight: 500
                          }}>
                            {sink.name} ({sink.type})
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  alignItems: 'center',
                  paddingTop: '24px',
                  borderTop: '1px solid #e1dfdd',
                  marginTop: '24px'
                }}>
                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    style={{
                      padding: '14px 28px',
                      backgroundColor: !isFormValid() ? '#f3f2f1' : '#0078d4',
                      color: !isFormValid() ? '#a19f9d' : '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: !isFormValid() ? 'not-allowed' : 'pointer',
                      boxShadow: !isFormValid() ? 'none' : '0 2px 4px rgba(0, 120, 212, 0.15)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Submit for Approval
                  </button>
                  <button
                    onClick={() => {
                      setSql('');
                      setKminField('');
                      setKminValue('');
                      setSelectedInputDatasets([]);
                      setInputKMins([{ id: '1', datasetName: '', value: '' }]);
                      setResultsLocations([]);
                      setDescription('');
                    }}
                    style={{
                      padding: '14px 28px',
                      backgroundColor: '#ffffff',
                      color: '#323130',
                      border: '1px solid #e1dfdd',
                      borderRadius: '6px',
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Clear All
                  </button>
                </div>

                {!isFormValid() && (
                  <div style={{ 
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    maxWidth: '400px',
                    padding: '12px 16px',
                    backgroundColor: '#fff4e5',
                    border: '1px solid #ff8c00',
                    borderRadius: '8px',
                    color: '#8a6914',
                    fontSize: '14px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    opacity: sql.trim() ? 0.9 : 1,
                    transition: 'opacity 0.2s ease'
                  }}>
                    ⚠️ Please provide SQL query, select input datasets, choose at least one results location, and ensure datasets from at least 2 different providers are available before submitting.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        ) : (
          <div style={{ 
            maxWidth: 1600,
            margin: '0 auto',
            width: '100%'
          }}>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              <div style={{ width: '35%', minWidth: '420px' }}>
                <Text style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600, color: '#323130' }}>
                  All Queries
                </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {queries.filter(query => !props.activeCleanroom || query.cleanroomId === props.activeCleanroom.id).map(query => (
                  <div
                    key={query.id}
                    onClick={() => setSelectedQuery(selectedQuery?.id === query.id ? null : query)}
                    style={{
                      padding: '16px',
                      border: selectedQuery?.id === query.id ? '2px solid #0078d4' : '1px solid #e1dfdd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: selectedQuery?.id === query.id ? '#f3f9ff' : '#ffffff',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedQuery?.id === query.id ? '0 2px 4px rgba(0, 120, 212, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, paddingRight: '16px' }}>
                        <Text style={{ fontWeight: 600, fontSize: '16px', color: '#323130', marginBottom: '8px', display: 'block' }}>
                          Query ID: {query.id}
                        </Text>
                        
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '8px',
                          padding: '12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px',
                          border: '1px solid #e1dfdd'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ 
                              padding: '2px 6px', 
                              backgroundColor: '#e1f5fe', 
                              borderRadius: '3px',
                              fontSize: '10px',
                              fontWeight: 500,
                              color: '#01579b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              minWidth: 'fit-content'
                            }}>
                              INPUT
                            </div>
                            <Text style={{ fontSize: '13px', color: '#323130', fontWeight: 500, lineHeight: '1.4' }}>
                              {query.selectedInputDatasets.join(', ')}
                            </Text>
                          </div>
                          
                          {query.resultsLocations && query.resultsLocations.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <div style={{ 
                                padding: '2px 6px', 
                                backgroundColor: '#e8f5e8', 
                                borderRadius: '3px',
                                fontSize: '10px',
                                fontWeight: 500,
                                color: '#1b5e20',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                minWidth: 'fit-content'
                              }}>
                                OUTPUT
                              </div>
                              <Text style={{ fontSize: '13px', color: '#323130', fontWeight: 500, lineHeight: '1.4' }}>
                                {query.resultsLocations.map(locationId => {
                                  const sink = props.dataSinks.find(s => s.id === locationId);
                                  return sink ? sink.name : 'Unknown';
                                }).join(', ')}
                              </Text>
                            </div>
                          )}
                          
                          {/* Show segments info for multi-segment queries */}
                          {query.segments && query.segments.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <div style={{ 
                                padding: '2px 6px', 
                                backgroundColor: '#f3e5f5', 
                                borderRadius: '3px',
                                fontSize: '10px',
                                fontWeight: 500,
                                color: '#6a1b9a',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                minWidth: 'fit-content'
                              }}>
                                SEGMENTS
                              </div>
                              <Text style={{ fontSize: '13px', color: '#323130', fontWeight: 500, lineHeight: '1.4' }}>
                                {query.segments.length} segments
                              </Text>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 500,
                            backgroundColor: 
                              query.status === 'approved' ? '#e7f7e7' :
                              query.status === 'rejected' ? '#fdeaea' : '#fff4e5',
                            color: 
                              query.status === 'approved' ? '#237f23' :
                              query.status === 'rejected' ? '#d13438' : '#8a6914'
                          }}
                        >
                          {getStatusDisplayText(query.status)}
                        </div>
                        {query.totalRuns > 0 && (
                          <div
                            style={{
                              padding: '2px 6px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              backgroundColor: '#e6f3ff',
                              color: '#0078d4',
                              fontWeight: 500
                            }}
                          >
                            {query.totalRuns} runs
                          </div>
                        )}
                        {hasKMinWarnings(query) && (
                          <div
                            style={{
                              padding: '2px 6px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              backgroundColor: '#fff4e5',
                              color: '#8a6914',
                              fontWeight: 500,
                              border: '1px solid #ff8c00'
                            }}
                            title="Missing input threshold or output filter values"
                          >
                            ⚠️ K-min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Always Present */}
            <div style={{ 
              flex: 1, 
              minWidth: '500px',
              paddingLeft: '32px', 
              paddingRight: '32px', 
              borderLeft: '1px solid #e1dfdd' 
            }}>
              <Text style={{ marginBottom: '24px', fontSize: '20px', fontWeight: 600, color: '#323130' }}>
                Query Details
              </Text>
              {selectedQuery ? (
                <div style={{ 
                  border: '1px solid #e1dfdd', 
                  borderRadius: '12px', 
                  padding: '32px',
                  backgroundColor: '#fafafa',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
                }}>
                  {/* Query Description */}
                  {selectedQuery.description && (
                    <div style={{ marginBottom: '24px' }}>
                      <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                        Description:
                      </Text>
                      <div style={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e1dfdd',
                        borderRadius: '8px',
                        padding: '16px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#323130'
                      }}>
                        {selectedQuery.description}
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '24px' }}>
                    <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                      SQL Query:
                    </Text>
                    {/* Check if query has segments for enhanced display - either from current segments or stored segments */}
                    {selectedQuery.sql && (querySegments.length > 0 || (selectedQuery.segments && selectedQuery.segments.length > 0)) ? (
                      <div style={{ 
                        backgroundColor: '#f8f8f8',
                        border: '1px solid #e1dfdd',
                        borderRadius: '8px',
                        padding: '0',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontSize: '14px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        lineHeight: '1.5'
                      }}>
                        {/* Display SQL with segment highlights */}
                        <div style={{ display: 'flex' }}>
                          {/* Line Numbers */}
                          <div style={{
                            backgroundColor: '#e8e8e8',
                            borderRight: '1px solid #d0d0d0',
                            padding: '16px 8px',
                            minWidth: '40px',
                            textAlign: 'right',
                            color: '#666',
                            fontSize: '12px',
                            userSelect: 'none'
                          }}>
                            {selectedQuery.sql.split('\n').map((_, index) => (
                              <div key={index} style={{ 
                                height: '21px', 
                                lineHeight: '21px',
                                position: 'relative'
                              }}>
                                {index + 1}
                                {/* Show segment indicators */}
                                {(querySegments.some(seg => seg.startLine === index + 1) || 
                                  (selectedQuery.segments && selectedQuery.segments.some((seg: any) => seg.startLine === index + 1))) && (
                                  <div style={{
                                    position: 'absolute',
                                    right: '-6px',
                                    top: '0',
                                    width: '8px',
                                    height: '21px',
                                    backgroundColor: '#0078d4',
                                    borderRadius: '0 4px 4px 0'
                                  }} />
                                )}
                              </div>
                            ))}
                          </div>
                          {/* Code Content */}
                          <div style={{ 
                            flex: 1,
                            padding: '16px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}>
                            {selectedQuery.sql.split('\n').map((line, index) => {
                              const lineNumber = index + 1;
                              const segment = querySegments.find(seg => 
                                lineNumber >= seg.startLine && lineNumber <= seg.endLine
                              ) || (selectedQuery.segments?.find((seg: any) => 
                                lineNumber >= seg.startLine && lineNumber <= seg.endLine
                              ));
                              const isSegmentStart = segment && (segment as any).startLine === lineNumber;
                              
                              return (
                                <div key={index} style={{ 
                                  height: '21px',
                                  lineHeight: '21px',
                                  backgroundColor: segment ? 'rgba(0, 120, 212, 0.1)' : 'transparent',
                                  marginLeft: isSegmentStart ? '0' : '0',
                                  borderLeft: segment ? '3px solid #0078d4' : 'none',
                                  paddingLeft: segment ? '8px' : '0',
                                  position: 'relative'
                                }}>
                                  {line}
                                  {isSegmentStart && (
                                    <span style={{
                                      position: 'absolute',
                                      right: '8px',
                                      top: '0',
                                      fontSize: '10px',
                                      color: '#0078d4',
                                      fontWeight: 'bold',
                                      backgroundColor: 'rgba(0, 120, 212, 0.1)',
                                      padding: '1px 4px',
                                      borderRadius: '2px'
                                    }}>
                                      {(segment as any).name || 'Segment'}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Original single query display */
                      <div style={{ 
                        backgroundColor: '#f8f8f8',
                        border: '1px solid #e1dfdd',
                        borderRadius: '8px',
                        padding: '16px',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontSize: '14px',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        lineHeight: '1.5'
                      }}>
                        {selectedQuery.sql}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                      Input Datasets:
                    </Text>
                    <ul style={{ margin: 0, paddingLeft: '24px', fontSize: '15px', lineHeight: '1.6' }}>
                      {selectedQuery.selectedInputDatasets.map(datasetName => (
                        <li key={datasetName} style={{ marginBottom: '4px' }}>{datasetName}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Query Structure - Segments or Single Query */}
                  {querySegments.length > 0 ? (
                    <>
                      <div style={{ marginBottom: '24px' }}>
                        <Text style={{ fontWeight: 600, marginBottom: '16px', display: 'block', fontSize: '16px' }}>
                          Query Segments ({querySegments.length}):
                        </Text>
                        {querySegments
                          .sort((a, b) => a.executionSequence - b.executionSequence)
                          .map((segment) => (
                          <div key={segment.id} style={{ 
                            marginBottom: '20px',
                            padding: '16px',
                            border: '1px solid #e1dfdd',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff'
                          }}>
                            <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '14px', color: '#0078d4' }}>
                              {segment.name} (Lines {segment.startLine}-{segment.endLine})
                            </Text>
                            
                            {/* Execution Sequence */}
                            <div style={{ marginBottom: '12px' }}>
                              <Text style={{ fontWeight: 500, marginBottom: '6px', display: 'block', fontSize: '13px' }}>
                                Execution Sequence:
                              </Text>
                              <div style={{ 
                                display: 'inline-block',
                                padding: '4px 8px',
                                backgroundColor: '#f0f8ff',
                                border: '1px solid #0078d4',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#0078d4'
                              }}>
                                #{segment.executionSequence}
                              </div>
                            </div>

                            {/* Input Threshold Values */}
                            <div style={{ marginBottom: '12px' }}>
                              <Text style={{ fontWeight: 500, marginBottom: '6px', display: 'block', fontSize: '13px' }}>
                                Input Threshold:
                              </Text>
                              {segment.inputKMins && segment.inputKMins.length > 0 && 
                               segment.inputKMins.some(kmin => 
                                 kmin.datasetName && kmin.datasetName.trim() !== '' && 
                                 kmin.value && String(kmin.value).trim() !== ''
                               ) ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  {segment.inputKMins
                                    .filter(kmin => kmin.datasetName && kmin.datasetName.trim() !== '' && kmin.value && String(kmin.value).trim() !== '')
                                    .map(inputKMin => (
                                    <div key={inputKMin.id} style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between',
                                      padding: '6px 10px',
                                      backgroundColor: '#e1f5fe',
                                      borderRadius: '4px',
                                      fontSize: '13px'
                                    }}>
                                      <span style={{ fontWeight: 500 }}>{inputKMin.datasetName}</span>
                                      <span style={{ color: '#0078d4', fontWeight: 600 }}>= {inputKMin.value}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ 
                                  padding: '6px 8px',
                                  backgroundColor: '#f8f8f8',
                                  border: '1px solid #d0d0d0',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  color: '#666',
                                  fontStyle: 'italic'
                                }}>
                                  No input threshold values configured
                                </div>
                              )}
                            </div>

                            {/* Output Filter Value */}
                            <div style={{ marginBottom: '8px' }}>
                              <Text style={{ fontWeight: 500, marginBottom: '6px', display: 'block', fontSize: '13px' }}>
                                Output Filter:
                              </Text>
                              {segment.outputKMinField && segment.outputKMinValue ? (
                                <div style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  padding: '6px 10px',
                                  backgroundColor: '#e8f5e8',
                                  borderRadius: '4px',
                                  fontSize: '13px'
                                }}>
                                  <span style={{ fontWeight: 500 }}>{segment.outputKMinField}</span>
                                  <span style={{ color: '#107c10', fontWeight: 600 }}>≥ {segment.outputKMinValue}</span>
                                </div>
                              ) : (
                                <div style={{ 
                                  padding: '6px 8px',
                                  backgroundColor: '#f8f8f8',
                                  border: '1px solid #d0d0d0',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  color: '#666',
                                  fontStyle: 'italic'
                                }}>
                                  No output filter value configured
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Summary Input K-min - only show warning if ALL segments are missing */}
                      <div style={{ marginBottom: '24px' }}>
                        <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                          Input Threshold Summary:
                        </Text>
                        {querySegments.some(segment => 
                          segment.inputKMins && segment.inputKMins.length > 0 &&
                          segment.inputKMins.some(kmin => 
                            kmin.datasetName && kmin.datasetName.trim() !== '' && 
                            kmin.value && String(kmin.value).trim() !== ''
                          )
                        ) ? (
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#e8f5e8',
                            border: '1px solid #107c10',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#107c10'
                          }}>
                            ✓ Input k-min values configured for {querySegments.filter(segment => 
                              segment.inputKMins && segment.inputKMins.length > 0 &&
                              segment.inputKMins.some(kmin => 
                                kmin.datasetName && kmin.datasetName.trim() !== '' && 
                                kmin.value && String(kmin.value).trim() !== ''
                              )
                            ).length} of {querySegments.length} segments
                          </div>
                        ) : (
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#fff4e5',
                            border: '1px solid #ff8c00',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#8a6914'
                          }}>
                            ⚠️ No input threshold values defined for any segment
                          </div>
                        )}
                      </div>

                      {/* Summary Output K-min - only show warning if ALL segments are missing */}
                      <div style={{ marginBottom: '24px' }}>
                        <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                          Output Filter Summary:
                        </Text>
                        {querySegments.some(segment => 
                          segment.outputKMinField && segment.outputKMinField.trim() !== '' &&
                          segment.outputKMinValue && String(segment.outputKMinValue).trim() !== ''
                        ) ? (
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#e8f5e8',
                            border: '1px solid #107c10',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#107c10'
                          }}>
                            ✓ Output filter values configured for {querySegments.filter(segment => 
                              segment.outputKMinField && segment.outputKMinField.trim() !== '' &&
                              segment.outputKMinValue && String(segment.outputKMinValue).trim() !== ''
                            ).length} of {querySegments.length} segments
                          </div>
                        ) : (
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#fff4e5',
                            border: '1px solid #ff8c00',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#8a6914'
                          }}>
                            ⚠️ No output filter values defined for any segment
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Summary Input Threshold - only show warning if ALL segments are missing OR if we have legacy single query */}
                      <div style={{ marginBottom: '24px' }}>
                        <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                          Input Threshold:
                        </Text>
                        {(querySegments.length > 0 && querySegments.some(segment => 
                          segment.inputKMins && segment.inputKMins.length > 0 &&
                          segment.inputKMins.some(kmin => 
                            kmin.datasetName && kmin.datasetName.trim() !== '' && 
                            kmin.value && String(kmin.value).trim() !== ''
                          )
                        )) || (selectedQuery.inputKMins && selectedQuery.inputKMins.length > 0 && 
                         selectedQuery.inputKMins.some(kmin => 
                           kmin.datasetName && kmin.datasetName.trim() !== '' && 
                           kmin.value && String(kmin.value).trim() !== ''
                         )) ? (
                          querySegments.length > 0 ? (
                            <div style={{ 
                              padding: '12px 16px',
                              backgroundColor: '#e8f5e8',
                              border: '1px solid #107c10',
                              borderRadius: '6px',
                              fontSize: '14px',
                              color: '#107c10'
                            }}>
                              ✓ Input k-min values configured for {querySegments.filter(segment => 
                                segment.inputKMins && segment.inputKMins.length > 0 &&
                                segment.inputKMins.some(kmin => 
                                  kmin.datasetName && kmin.datasetName.trim() !== '' && 
                                  kmin.value && String(kmin.value).trim() !== ''
                                )
                              ).length} of {querySegments.length} segments
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {selectedQuery.inputKMins!
                                .filter(kmin => 
                                  kmin.datasetName && kmin.datasetName.trim() !== '' && 
                                  kmin.value && String(kmin.value).trim() !== ''
                                )
                                .map(inputKMin => (
                                <div key={inputKMin.id} style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  padding: '8px 12px',
                                  backgroundColor: '#e1f5fe',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}>
                                  <span style={{ fontWeight: 500 }}>{inputKMin.datasetName}</span>
                                  <span>{inputKMin.value}</span>
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#fff4e5',
                            border: '1px solid #ff8c00',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#8a6914'
                          }}>
                            ⚠️ No input threshold values defined{querySegments.length > 0 ? ' for any segment' : ''}
                          </div>
                        )}
                      </div>

                      {/* Summary Output Filter - only show warning if ALL segments are missing OR if we have legacy single query */}
                      <div style={{ marginBottom: '24px' }}>
                        <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                          Output Filter:
                        </Text>
                        {(querySegments.length > 0 && querySegments.some(segment => 
                          segment.outputKMinField && segment.outputKMinField.trim() !== '' &&
                          segment.outputKMinValue && String(segment.outputKMinValue).trim() !== ''
                        )) || (selectedQuery.kminField && selectedQuery.kminValue) ? (
                          querySegments.length > 0 ? (
                            <div style={{ 
                              padding: '12px 16px',
                              backgroundColor: '#e8f5e8',
                              border: '1px solid #107c10',
                              borderRadius: '6px',
                              fontSize: '14px',
                              color: '#107c10'
                            }}>
                              ✓ Output filter values configured for {querySegments.filter(segment => 
                                segment.outputKMinField && segment.outputKMinField.trim() !== '' &&
                                segment.outputKMinValue && String(segment.outputKMinValue).trim() !== ''
                              ).length} of {querySegments.length} segments
                            </div>
                          ) : (
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              backgroundColor: '#e8f5e8',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}>
                              <span style={{ fontWeight: 500 }}>{selectedQuery.kminField}</span>
                              <span>{selectedQuery.kminValue}</span>
                            </div>
                          )
                        ) : (
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#fff4e5',
                            border: '1px solid #ff8c00',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#8a6914'
                          }}>
                            ⚠️ No output filter value defined{querySegments.length > 0 ? ' for any segment' : ''}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Legacy K-min Configuration (for backward compatibility) */}
                  {selectedQuery.kminField && !selectedQuery.segments && (
                    <div style={{ marginBottom: '24px' }}>
                      <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                        K-min Configuration:
                      </Text>
                      <Text style={{ fontSize: '15px', lineHeight: '1.6' }}>
                        Field: <span style={{ fontWeight: 500 }}>{selectedQuery.kminField}</span>, 
                        Value: <span style={{ fontWeight: 500 }}>{selectedQuery.kminValue}</span>
                      </Text>
                    </div>
                  )}

                  {selectedQuery.resultsLocations && selectedQuery.resultsLocations.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                        Results Locations:
                      </Text>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedQuery.resultsLocations.map(locationId => {
                          const sink = props.dataSinks.find(s => s.id === locationId);
                          return sink ? (
                            <Text key={locationId} style={{ fontSize: '15px', lineHeight: '1.6' }}>
                              • {sink.name} ({sink.type})
                            </Text>
                          ) : (
                            <Text key={locationId} style={{ fontSize: '15px', color: '#a4262c', lineHeight: '1.6' }}>
                              • Unknown location (ID: {locationId})
                            </Text>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '24px' }}>
                    <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '16px' }}>
                      Status:
                    </Text>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontWeight: 500,
                        backgroundColor: 
                          selectedQuery.status === 'approved' ? '#e7f7e7' :
                          selectedQuery.status === 'rejected' ? '#fdeaea' : '#fff4e5',
                        color: 
                          selectedQuery.status === 'approved' ? '#237f23' :
                          selectedQuery.status === 'rejected' ? '#d13438' : '#8a6914'
                      }}
                    >
                      {getStatusDisplayText(selectedQuery.status)}
                    </div>
                    {selectedQuery.approvedAt && (
                      <Text style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                        (Approved on {new Date(selectedQuery.approvedAt).toLocaleString()})
                      </Text>
                    )}
                    {selectedQuery.rejectedAt && (
                      <div style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                        (Rejected on {new Date(selectedQuery.rejectedAt).toLocaleString()})
                        {selectedQuery.rejectionReason && (
                          <div style={{ 
                            marginTop: '4px', 
                            color: '#d13438', 
                            fontWeight: 500,
                            fontSize: '12px'
                          }}>
                            Reason: {selectedQuery.rejectionReason}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedQuery.executions.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <Text style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                        Execution History:
                      </Text>
                      <div style={{ 
                        backgroundColor: '#f8f8f8',
                        border: '1px solid #e1dfdd',
                        borderRadius: '4px',
                        padding: '12px',
                        maxHeight: '120px',
                        overflowY: 'auto'
                      }}>
                        {selectedQuery.executions.map(execution => (
                          <div key={execution.runId} style={{ 
                            fontSize: '13px', 
                            marginBottom: '8px',
                            padding: '8px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            border: '1px solid #e1dfdd'
                          }}>
                            <div style={{ 
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '4px'
                            }}>
                              <span>
                                {execution.status === 'running' ? '🔄' : 
                                 execution.status === 'stopped' ? '⏹️' : 
                                 execution.status === 'failed' ? '❌' : '✅'} Run #{selectedQuery.executions.indexOf(execution) + 1}
                              </span>
                              <span style={{ color: '#666' }}>
                                {execution.status === 'running' 
                                  ? 'Running...' 
                                  : execution.status === 'stopped'
                                  ? `Stopped after ${execution.duration}ms (${new Date(execution.completedAt!).toLocaleString()})`
                                  : `${execution.duration}ms (${new Date(execution.completedAt!).toLocaleString()})`
                                }
                              </span>
                            </div>
                            {(execution.queryStartDate || execution.queryEndDate) && (
                              <div style={{ fontSize: '12px', color: '#605e5c' }}>
                                📅 Query Period: {execution.queryStartDate && `from ${execution.queryStartDate}`}{execution.queryStartDate && execution.queryEndDate && ' '}{execution.queryEndDate && `to ${execution.queryEndDate}`}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    alignItems: 'center', 
                    flexWrap: 'wrap',
                    marginTop: '8px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e1dfdd'
                  }}>
                    {selectedQuery.status === 'pending' && (
                      <>
                        <DefaultButton
                          text="✅ Approve"
                          onClick={() => handleApprove(selectedQuery.id)}
                          style={{ backgroundColor: '#e7f7e7', color: '#237f23', border: '1px solid #b3d9b3' }}
                        />
                        <DefaultButton
                          text="❌ Reject"
                          onClick={() => {
                            setShowRejectInput(true);
                            setRejectingQueryId(selectedQuery.id);
                          }}
                          style={{ backgroundColor: '#fdeaea', color: '#d13438', border: '1px solid #f5b7b1' }}
                        />
                      </>
                    )}
                    {showRejectInput && rejectingQueryId === selectedQuery.id && (
                      <div style={{ 
                        width: '100%', 
                        marginTop: '16px',
                        padding: '16px',
                        backgroundColor: '#fff8f8',
                        border: '1px solid #f5b7b1',
                        borderRadius: '8px'
                      }}>
                        <Text style={{ fontWeight: 500, marginBottom: '8px', display: 'block', fontSize: '14px' }}>
                          Please provide a reason for rejection:
                        </Text>
                        <textarea
                          value={rejectionReason}
                          onChange={e => setRejectionReason(e.target.value)}
                          style={{ 
                            width: '100%', 
                            minHeight: '60px', 
                            padding: '8px', 
                            borderRadius: '4px', 
                            border: '1px solid #e1dfdd', 
                            fontSize: '14px', 
                            marginBottom: '12px',
                            resize: 'vertical'
                          }}
                          placeholder="Enter reason for rejection..."
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <DefaultButton
                            text="Confirm Reject"
                            onClick={() => {
                              handleReject(selectedQuery.id, rejectionReason);
                              setShowRejectInput(false);
                              setRejectionReason('');
                              setRejectingQueryId(null);
                            }}
                            style={{ backgroundColor: '#d13438', color: '#ffffff', border: '1px solid #d13438' }}
                            disabled={!rejectionReason.trim()}
                          />
                          <DefaultButton
                            text="Cancel"
                            onClick={() => {
                              setShowRejectInput(false);
                              setRejectionReason('');
                              setRejectingQueryId(null);
                            }}
                            style={{ backgroundColor: '#f8f9fa', color: '#323130', border: '1px solid #e1dfdd' }}
                          />
                        </div>
                      </div>
                    )}
                    {selectedQuery.status === 'approved' && (
                      <>
                        {/* Date Parameters Section */}
                        {!selectedQuery.executions.some(e => e.status === 'running') && (
                          <div style={{
                            marginBottom: '16px',
                            padding: '16px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e1dfdd',
                            borderRadius: '8px'
                          }}>
                            <Text style={{ fontWeight: 600, marginBottom: '12px', display: 'block', fontSize: '14px', color: '#323130' }}>
                              Optional Query Parameters
                            </Text>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <div>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: '#605e5c', marginBottom: '4px', display: 'block' }}>
                                  Start Date (optional)
                                </label>
                                <input
                                  type="date"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #e1dfdd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: '#605e5c', marginBottom: '4px', display: 'block' }}>
                                  End Date (optional)
                                </label>
                                <input
                                  type="date"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #e1dfdd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                            </div>
                            {(startDate || endDate) && (
                              <Text style={{ fontSize: '12px', color: '#605e5c', marginTop: '8px' }}>
                                Query will be filtered {startDate && `from ${startDate}`}{startDate && endDate && ' '}{endDate && `to ${endDate}`}
                              </Text>
                            )}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          {selectedQuery.executions.some(e => e.status === 'running') ? (
                            <DefaultButton
                              text="⏹️ Stop Query"
                              onClick={() => handleStop(selectedQuery.id)}
                              style={{
                                backgroundColor: '#d13438',
                                color: '#ffffff',
                                border: '1px solid #d13438'
                              }}
                            />
                          ) : (
                            <DefaultButton
                              text={
                                !hasEnabledDataSinks ? '⚠️ No Data Sinks' : '▶️ Run Query'
                              }
                              onClick={() => handleRun(selectedQuery.id, startDate, endDate)}
                              disabled={!hasEnabledDataSinks}
                              style={{
                                backgroundColor: !hasEnabledDataSinks ? '#fff4e5' : undefined,
                                color: !hasEnabledDataSinks ? '#8a6914' : undefined,
                                border: !hasEnabledDataSinks ? '1px solid #ff8c00' : undefined
                              }}
                            />
                          )}
                          <DefaultButton
                            text="🚫 Withdraw Consent"
                            onClick={() => handleWithdrawConsent(selectedQuery.id)}
                            style={{ backgroundColor: '#fff2f0', color: '#d13438', border: '1px solid #ff9999' }}
                          />
                        </div>
                        <Text style={{ fontSize: '14px', marginLeft: '8px' }}>
                          Total Runs: <span style={{ fontWeight: 500 }}>{selectedQuery.totalRuns}</span>
                        </Text>
                        {!hasEnabledDataSinks && (
                          <Text style={{ fontSize: '12px', color: '#8a6914', marginLeft: '8px' }}>
                            Configure data sinks in Publish Datasets to enable query execution
                          </Text>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ 
                  border: '1px solid #e1dfdd', 
                  borderRadius: '12px', 
                  padding: '64px 32px',
                  backgroundColor: '#fafafa',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                  textAlign: 'center',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '24px',
                    color: '#a19f9d'
                  }}>
                    📋
                  </div>
                  <Text style={{ 
                    fontSize: '18px', 
                    color: '#605e5c',
                    lineHeight: '28px',
                    maxWidth: '300px'
                  }}>
                    Select a query from the list to view its details, SQL code, and execution options.
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');

  const timeRangeOptions = [
    { key: '1d', text: 'Last 24 hours' },
    { key: '7d', text: 'Last 7 days' },
    { key: '30d', text: 'Last 30 days' },
    { key: '90d', text: 'Last 90 days' },
  ];

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock audit log data
    const mockLogs = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        action: 'Query Submitted',
        user: 'amit@contoso.com',
        resource: 'collaboration_id_12345',
        details: 'Query "Marketing Campaign Analysis" submitted for approval',
        status: 'Success',
        ipAddress: '192.168.1.10'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        action: 'Dataset Published',
        user: 'amit@contoso.com',
        resource: 'contoso_input',
        details: 'Dataset published to collaboration with AES-256 encryption',
        status: 'Success',
        ipAddress: '192.168.1.10'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        action: 'Member Invited',
        user: 'amit@contoso.com',
        resource: 'collaboration_id_12345',
        details: 'Invited ram@fabrikam.com to join collaboration',
        status: 'Success',
        ipAddress: '192.168.1.10'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        action: 'Query Executed',
        user: 'ram@fabrikam.com',
        resource: 'query_789',
        details: 'Executed approved query against consumer_input and contoso_input datasets',
        status: 'Success',
        ipAddress: '10.0.0.25'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        action: 'Authentication',
        user: 'ram@fabrikam.com',
        resource: 'collaboration_id_12345',
        details: 'User authenticated via Azure AD',
        status: 'Success',
        ipAddress: '10.0.0.25'
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        action: 'Data Access',
        user: 'system',
        resource: 'contoso_input',
        details: 'Automated data integrity check completed',
        status: 'Success',
        ipAddress: 'internal'
      }
    ];

    setAuditLogs(mockLogs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [selectedTimeRange]);

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadLogs = () => {
    const csvContent = [
      'Timestamp,Action,User,Resource,Details,Status,IP Address',
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.action}","${log.user}","${log.resource}","${log.details}","${log.status}","${log.ipAddress}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${selectedTimeRange}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return '✅';
      case 'Failed': return '❌';
      case 'Warning': return '⚠️';
      default: return '📋';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Query Submitted': return '📝';
      case 'Query Executed': return '⚡';
      case 'Dataset Published': return '📊';
      case 'Member Invited': return '👥';
      case 'Authentication': return '🔐';
      case 'Data Access': return '🗂️';
      default: return '📋';
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 600, 
          marginBottom: '24px', 
          lineHeight: '1.2',
          margin: '0 0 24px 0',
          color: '#323130'
        }}>
          Audit
        </h1>
        <p style={{ 
          color: '#605e5c', 
          fontSize: '16px', 
          lineHeight: '1.6', 
          margin: '24px 0 0 0'
        }}>
          Monitor collaboration activities, track data access, and download comprehensive audit logs
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text style={{ fontWeight: 500 }}>Time Range:</Text>
          <Dropdown
            placeholder="Select time range"
            options={timeRangeOptions}
            selectedKey={selectedTimeRange}
            onChange={(_, option) => setSelectedTimeRange(option?.key as string)}
            styles={{ 
              dropdown: { width: 150 },
              root: { minWidth: 150 }
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '400px' }}>
          <Text style={{ fontWeight: 500 }}>Search:</Text>
          <SearchBox
            placeholder="Search logs by action, user, or details..."
            value={searchQuery}
            onChange={(_, newValue) => setSearchQuery(newValue || '')}
            styles={{ root: { flex: 1 } }}
          />
        </div>

        <PrimaryButton
          text="📥 Download CSV"
          onClick={downloadLogs}
          disabled={filteredLogs.length === 0}
          iconProps={{ iconName: 'Download' }}
        />

        <DefaultButton
          text="🔄 Refresh"
          onClick={fetchAuditLogs}
          disabled={isLoading}
          iconProps={{ iconName: 'Refresh' }}
        />
      </div>

      {isLoading ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '48px',
          border: '1px solid #e1dfdd',
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          <Spinner size={SpinnerSize.large} />
          <Text style={{ marginLeft: '16px', fontSize: '16px' }}>Loading audit logs...</Text>
        </div>
      ) : (
        <>
          <div style={{ 
            marginBottom: '16px',
            padding: '12px 16px',
            backgroundColor: '#f3f2f1',
            border: '1px solid #e1dfdd',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text style={{ fontWeight: 500 }}>
              {filteredLogs.length} audit log{filteredLogs.length !== 1 ? 's' : ''} found
            </Text>
            <Text style={{ color: '#605e5c' }}>
              Time range: {timeRangeOptions.find(opt => opt.key === selectedTimeRange)?.text}
            </Text>
          </div>

          <div style={{ 
            border: '1px solid #e1dfdd',
            borderRadius: '8px',
            backgroundColor: 'white',
            overflow: 'hidden'
          }}>
            {filteredLogs.length === 0 ? (
              <div style={{ 
                padding: '48px',
                textAlign: 'center',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '16px', color: '#a19f9d' }}>
                  🔍
                </div>
                <Text style={{ fontSize: '16px', color: '#605e5c' }}>
                  No audit logs found matching your search criteria
                </Text>
              </div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {filteredLogs.map((log, index) => (
                  <div
                    key={log.id}
                    style={{
                      padding: '16px 20px',
                      borderBottom: index < filteredLogs.length - 1 ? '1px solid #f3f2f1' : 'none',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{getActionIcon(log.action)}</span>
                        <Text style={{ fontWeight: 600, fontSize: '15px' }}>
                          {log.action}
                        </Text>
                        <span style={{ fontSize: '14px' }}>{getStatusIcon(log.status)}</span>
                      </div>
                      <Text style={{ 
                        color: '#605e5c', 
                        fontSize: '13px',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                      }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </Text>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <Text style={{ fontSize: '14px', color: '#323130' }}>
                        {log.details}
                      </Text>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      gap: '16px',
                      fontSize: '13px',
                      color: '#605e5c'
                    }}>
                      <span>
                        <strong>User:</strong> {log.user}
                      </span>
                      <span>
                        <strong>Resource:</strong> {log.resource}
                      </span>
                      <span>
                        <strong>IP:</strong> {log.ipAddress}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Consumer dataset that should only be available when Ram is logged in
const consumerInputDataset = {
  name: 'consumer_input',
  provider: 'Fabrikam',
  encryption: 'AES-256',
  schema: {
    "campaign_id": { "type": "integer" },
    "user_id": { "type": "string" },
    "impressions": { "type": "integer" },
    "clicks": { "type": "integer" },
    "spend": { "type": "double" },
    "conversion_count": { "type": "integer" },
    "age_group": { "type": "string" },
    "gender": { "type": "string" },
    "location": { "type": "string" }
  },
  columns: [
    { name: 'campaign_id', type: 'integer', approved: true, kmin: 100 },
    { name: 'user_id', type: 'string', approved: true, kmin: 500 },
    { name: 'impressions', type: 'integer', approved: true },
    { name: 'clicks', type: 'integer', approved: true },
    { name: 'spend', type: 'double', approved: true },
    { name: 'conversion_count', type: 'integer', approved: true },
    { name: 'age_group', type: 'string', approved: true },
    { name: 'gender', type: 'string', approved: false },
    { name: 'location', type: 'string', approved: true }
  ],
  azureArmId: '/subscriptions/dev-subscription/resourceGroups/data-rg/providers/Microsoft.Storage/storageAccounts/advertiserdata',
  azureIdentity: '/subscriptions/dev-subscription/resourceGroups/data-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/advertiser-data-identity',
  azureKeyArmId: '/subscriptions/dev-subscription/resourceGroups/security-rg/providers/Microsoft.KeyVault/vaults/advertiser-kv/keys/data-key',
  cleanroomPolicy: 'strict-access-control',
  s3Bucket: '',
  s3Secret: '',
  s3EncryptionKey: '',
  kminFields: { 'campaign_id': 100, 'user_id': 500 },
  dataSinks: []
};

function AppRoutes({ cleanrooms, setActiveCleanroom, activeCleanroom, loggedInUser, membersInitialTab, setCleanrooms, datasets, setDatasets, dataSinks, setDataSinks, isActiveMember }: any) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cleanrooms" />} />
      <Route path="/cleanrooms" element={
        <CleanroomsPage 
          key={activeCleanroom?.id || 'no-cleanroom'}
          cleanrooms={cleanrooms}
          setActiveCleanroom={setActiveCleanroom}
          activeCleanroom={activeCleanroom}
          loggedInUser={loggedInUser}
        />
      } />
      <Route path="/members" element={
        activeCleanroom ? (
          <MembersPage 
            members={activeCleanroom.members} 
            setMembers={(newMembers) => {
              const updatedCleanrooms = cleanrooms.map((cr: any) => 
                cr.id === activeCleanroom.id ? { ...cr, members: newMembers } : cr
              );
              setCleanrooms(updatedCleanrooms);
              setActiveCleanroom({ ...activeCleanroom, members: newMembers });
            }} 
            loggedInUser={loggedInUser} 
            datasets={datasets} 
            setDatasets={setDatasets}
            initialTab={membersInitialTab}
            activeCleanroom={activeCleanroom}
          />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Text variant="large" styles={{ root: { color: '#a4262c' } }}>
              Please select a collaboration first to view members.
            </Text>
          </div>
        )
      } />
      <Route path="/publish" element={isActiveMember ? <PublishDatasetsPage datasets={datasets.filter((ds: any) => !activeCleanroom || ds.cleanroomId === activeCleanroom.id)} setDatasets={setDatasets} dataSinks={dataSinks} setDataSinks={setDataSinks} loggedInUser={loggedInUser} activeCleanroom={activeCleanroom} /> : <Text variant="large" styles={{ root: { color: '#a4262c', marginTop: 32 } }}>You must activate your membership to publish datasets.</Text>} />
      <Route path="/queries" element={isActiveMember ? <QueriesPage datasets={datasets.filter((ds: any) => !activeCleanroom || ds.cleanroomId === activeCleanroom.id)} dataSinks={dataSinks} loggedInUser={loggedInUser} activeCleanroom={activeCleanroom} /> : <Text variant="large" styles={{ root: { color: '#a4262c', marginTop: 32 } }}>You must activate your membership to use queries.</Text>} />
      <Route path="/summary" element={isActiveMember ? <SummaryPage datasets={datasets.filter((ds: any) => !activeCleanroom || ds.cleanroomId === activeCleanroom.id)} loggedInUser={loggedInUser} activeCleanroom={activeCleanroom} /> : <Text variant="large" styles={{ root: { color: '#a4262c', marginTop: 32 } }}>You must activate your membership to view summary.</Text>} />
      <Route path="/audit" element={isActiveMember ? <AuditPage /> : <Text variant="large" styles={{ root: { color: '#a4262c', marginTop: 32 } }}>You must activate your membership to view audit logs.</Text>} />
    </Routes>
  );
}

export default function App() {
  // Add global debug functions for console access
  (window as any).resetDatasets = () => {
    console.log('Resetting datasets via console command...');
    localStorage.removeItem('datasets');
    window.location.reload();
  };
  
  (window as any).clearAll = () => {
    console.log('Clearing all localStorage via console command...');
    localStorage.clear();
    window.location.reload();
  };

  // Clean up old localStorage data and ensure correct defaults
  useEffect(() => {
    const storedMembers = localStorage.getItem('members');
    if (storedMembers) {
      const parsed = JSON.parse(storedMembers);
      // Check if members have old microsoft.com emails and reset if needed
      if (parsed.some((m: any) => m.email.includes('microsoft.com'))) {
        localStorage.removeItem('members');
        localStorage.removeItem('loggedInUserEmail');
      }
    }
  }, []);

  // Simulated authentication and state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [members, setMembers] = useState(() => {
    const stored = localStorage.getItem('members');
    if (stored) return JSON.parse(stored);
    return [
      { name: 'Amit', email: 'amit@contoso.com', org: 'Contoso', status: 'Active', role: 'Owner' },
      { name: 'Ram', email: 'ram@fabrikam.com', org: 'Fabrikam', status: 'Invited', role: 'Member' },
    ];
  });
  
  // Cleanrooms management
  const [cleanrooms, setCleanrooms] = useState(() => {
    const stored = localStorage.getItem('cleanrooms');
    if (stored) return JSON.parse(stored);
    return [
      {
        id: 'cr-1',
        name: 'Contoso Fabrikam Measurement',
        description: 'Privacy-preserving measurement and analytics collaboration between Contoso and Fabrikam',
        createdDate: '2024-10-01',
        members: [
          { name: 'Amit', email: 'amit@contoso.com', org: 'Contoso', status: 'Active', role: 'Owner' },
          { name: 'Ram', email: 'ram@fabrikam.com', org: 'Fabrikam', status: 'Active', role: 'Member' },
        ]
      },
      {
        id: 'cr-2', 
        name: 'Contoso Fabrikam Targeting',
        description: 'Audience targeting and activation cleanroom for marketing campaigns',
        createdDate: '2024-09-15',
        members: [
          { name: 'Amit', email: 'amit@contoso.com', org: 'Contoso', status: 'Active', role: 'Owner' },
          { name: 'Ram', email: 'ram@fabrikam.com', org: 'Fabrikam', status: 'Invited', role: 'Member' },
        ]
      },
      {
        id: 'cr-3',
        name: 'Retail Analytics Hub',
        description: 'Cross-platform retail analytics and customer insights collaboration',
        createdDate: '2024-08-20',
        members: [
          { name: 'Amit', email: 'amit@contoso.com', org: 'Contoso', status: 'Active', role: 'Member' },
          { name: 'Lisa Chen', email: 'lisa@adventure-works.com', org: 'Adventure Works', status: 'Active', role: 'Owner' },
          { name: 'Michael Davis', email: 'michael@northwind.com', org: 'Northwind', status: 'Active', role: 'Member' },
        ]
      },
      {
        id: 'cr-4',
        name: 'Healthcare Research Consortium',
        description: 'Secure healthcare data analysis for medical research and population health insights',
        createdDate: '2024-07-10',
        members: [
          { name: 'Amit', email: 'amit@contoso.com', org: 'Contoso', status: 'Active', role: 'Member' },
          { name: 'Dr. Elena Rodriguez', email: 'elena@healthcorp.com', org: 'HealthCorp', status: 'Active', role: 'Owner' },
          { name: 'James Wilson', email: 'james@medtech.com', org: 'MedTech Solutions', status: 'Active', role: 'Member' },
        ]
      },
      {
        id: 'cr-5',
        name: 'Financial Services Analytics',
        description: 'Privacy-preserving financial data analysis and risk assessment platform',
        createdDate: '2024-06-05',
        members: [
          { name: 'Amit', email: 'amit@contoso.com', org: 'Contoso', status: 'Active', role: 'Owner' },
          { name: 'Jennifer Park', email: 'jennifer@globalbank.com', org: 'Global Bank', status: 'Active', role: 'Member' },
          { name: 'Robert Kim', email: 'robert@fintech.com', org: 'FinTech Corp', status: 'Active', role: 'Member' },
        ]
      }
    ];
  });
  
  const [activeCleanroom, setActiveCleanroom] = useState(() => {
    const stored = localStorage.getItem('activeCleanroom');
    console.log('INIT - Active cleanroom from localStorage:', stored);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('INIT - Parsed active cleanroom:', parsed);
      return parsed;
    }
    
    // Get the logged-in user email
    const loggedInEmail = localStorage.getItem('loggedInUserEmail') || 'amit@contoso.com';
    console.log('INIT - Logged in user:', loggedInEmail);
    
    // Find a cleanroom where the user has a pending invitation
    const pendingCleanroom = cleanrooms.find((cr: any) => {
      const userMembership = cr.members.find((m: any) => m.email === loggedInEmail);
      return userMembership && userMembership.status === 'Invited';
    });
    
    // Return pending cleanroom if found, otherwise first cleanroom
    return pendingCleanroom || cleanrooms[0] || null;
  });
  
  const [membersInitialTab] = useState<'invite' | 'view'>('view');
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(() => {
    return localStorage.getItem('loggedInUserEmail') || 'amit@contoso.com';
  });
  
  // Get logged in user from active cleanroom members, fallback to original members
  const loggedInUser = (() => {
    if (activeCleanroom) {
      return activeCleanroom.members.find((m: any) => m.email === loggedInUserEmail) || 
             activeCleanroom.members[0] || 
             members.find((m: any) => m.email === loggedInUserEmail) || 
             members[0];
    }
    return members.find((m: any) => m.email === loggedInUserEmail) || members[0];
  })();
  
  // Sync localStorage when state changes
  useEffect(() => {
    localStorage.setItem('cleanrooms', JSON.stringify(cleanrooms));
  }, [cleanrooms]);
  
  useEffect(() => {
    if (activeCleanroom) {
      localStorage.setItem('activeCleanroom', JSON.stringify(activeCleanroom));
    }
  }, [activeCleanroom]);
  
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);
  
  useEffect(() => {
    localStorage.setItem('loggedInUserEmail', loggedInUserEmail);
  }, [loggedInUserEmail]);
  
  const [datasets, setDatasets] = useState<any[]>(() => {
    const stored = localStorage.getItem('datasets');
    console.log('INIT - localStorage datasets:', stored);
    if (stored) {
      const parsedDatasets = JSON.parse(stored);
      console.log('INIT - Parsed datasets:', parsedDatasets);
      
      // Auto-migration: Update contoso_input to be in cr-2 if it's still in cr-1
      const updatedDatasets = parsedDatasets.map((ds: any) => {
        if (ds.name === 'contoso_input' && ds.cleanroomId === 'cr-1') {
          console.log('INIT - Migrating contoso_input from cr-1 to cr-2');
          return { ...ds, cleanroomId: 'cr-2' };
        }
        return ds;
      });
      
      // If we made changes, save them back to localStorage
      if (JSON.stringify(updatedDatasets) !== JSON.stringify(parsedDatasets)) {
        console.log('INIT - Saving migrated datasets');
        localStorage.setItem('datasets', JSON.stringify(updatedDatasets.filter((ds: any) => ds.name !== 'consumer_input')));
      }
      
      console.log('INIT - Final datasets after migration:', updatedDatasets);
      return updatedDatasets;
    }
    
    // Default datasets for first-time users
    console.log('INIT - Creating default datasets (localStorage was empty)');
    const defaultDatasets = [
      {
        name: 'contoso_input',
        provider: 'Contoso',
        cleanroomId: 'cr-2',
        encryption: 'AES-256',
        schema: {
          "line_item_id": { "type": "integer" },
          "hours": { "type": "integer" },
          "t_val": { "type": "double" },
          "advertiser_id": { "type": "string" },
          "device_type": { "type": "string" },
          "video_hit_25_pct": { "type": "integer" },
          "video_hit_50_pct": { "type": "integer" },
          "video_hit_75_pct": { "type": "integer" },
          "video_hit_100_pct": { "type": "integer" },
          "country": { "type": "string" }
        },
        columns: [
          { name: 'line_item_id', type: 'integer', approved: true, kmin: 300 },
          { name: 'hours', type: 'integer', approved: true },
          { name: 't_val', type: 'double', approved: true },
          { name: 'advertiser_id', type: 'string', approved: true },
          { name: 'device_type', type: 'string', approved: false },
          { name: 'video_hit_25_pct', type: 'integer', approved: true },
          { name: 'video_hit_50_pct', type: 'integer', approved: true },
          { name: 'video_hit_75_pct', type: 'integer', approved: true },
          { name: 'video_hit_100_pct', type: 'integer', approved: true },
          { name: 'country', type: 'string', approved: true }
        ],
        azureArmId: '/subscriptions/dev-subscription/resourceGroups/data-rg/providers/Microsoft.Storage/storageAccounts/publisherdata',
        azureIdentity: '/subscriptions/dev-subscription/resourceGroups/data-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/publisher-data-identity',
        azureKeyArmId: '/subscriptions/dev-subscription/resourceGroups/security-rg/providers/Microsoft.KeyVault/vaults/publisher-kv/keys/data-key',
        cleanroomPolicy: 'strict-access-control',
        s3Bucket: '',
        s3Secret: '',
        s3EncryptionKey: '',
        kminFields: { 'line_item_id': 300 },
        dataSinks: []
      },
      {
        name: 'fabrikam_audience_data',
        provider: 'Fabrikam',
        cleanroomId: 'cr-1',
        encryption: 'AES-256',
        schema: {
          "user_id": { "type": "string" },
          "age_group": { "type": "string" },
          "gender": { "type": "string" },
          "interest_category": { "type": "string" },
          "region": { "type": "string" },
          "engagement_score": { "type": "double" }
        },
        columns: [
          { name: 'user_id', type: 'string', approved: true, kmin: 100 },
          { name: 'age_group', type: 'string', approved: true },
          { name: 'gender', type: 'string', approved: true },
          { name: 'interest_category', type: 'string', approved: true },
          { name: 'region', type: 'string', approved: true },
          { name: 'engagement_score', type: 'double', approved: true }
        ],
        kminFields: { 'user_id': 100 }
      },
      {
        name: 'retail_transaction_data',
        provider: 'Adventure Works',
        cleanroomId: 'cr-3',
        encryption: 'AES-256',
        schema: {
          "transaction_id": { "type": "string" },
          "customer_id": { "type": "string" },
          "product_category": { "type": "string" },
          "purchase_amount": { "type": "double" },
          "transaction_date": { "type": "date" }
        },
        columns: [
          { name: 'transaction_id', type: 'string', approved: true },
          { name: 'customer_id', type: 'string', approved: true, kmin: 500 },
          { name: 'product_category', type: 'string', approved: true },
          { name: 'purchase_amount', type: 'double', approved: true },
          { name: 'transaction_date', type: 'date', approved: true }
        ],
        kminFields: { 'customer_id': 500 }
      },
      {
        name: 'healthcare_patient_outcomes',
        provider: 'HealthCorp',
        cleanroomId: 'cr-4',
        encryption: 'AES-256',
        schema: {
          "patient_id": { "type": "string" },
          "treatment_type": { "type": "string" },
          "outcome_score": { "type": "double" },
          "demographics": { "type": "string" },
          "comorbidities": { "type": "string" }
        },
        columns: [
          { name: 'patient_id', type: 'string', approved: true, kmin: 1000 },
          { name: 'treatment_type', type: 'string', approved: true },
          { name: 'outcome_score', type: 'double', approved: true },
          { name: 'demographics', type: 'string', approved: true },
          { name: 'comorbidities', type: 'string', approved: false }
        ],
        kminFields: { 'patient_id': 1000 }
      },
      {
        name: 'financial_risk_metrics',
        provider: 'Global Bank',
        cleanroomId: 'cr-5',
        encryption: 'AES-256',
        schema: {
          "account_id": { "type": "string" },
          "risk_score": { "type": "double" },
          "transaction_volume": { "type": "integer" },
          "account_type": { "type": "string" },
          "credit_rating": { "type": "string" }
        },
        columns: [
          { name: 'account_id', type: 'string', approved: true, kmin: 200 },
          { name: 'risk_score', type: 'double', approved: true },
          { name: 'transaction_volume', type: 'integer', approved: true },
          { name: 'account_type', type: 'string', approved: true },
          { name: 'credit_rating', type: 'string', approved: false }
        ],
        kminFields: { 'account_id': 200 }
      }
    ];
    
    return defaultDatasets;
  });
  const [dataSinks, setDataSinks] = useState<any[]>(() => {
    const stored = localStorage.getItem('dataSinks');
    if (stored) return JSON.parse(stored);
    return [];
  });
  // Check if user is active member in current cleanroom
  const isActiveMember = activeCleanroom ? 
    activeCleanroom.members.find((m: any) => m.email === loggedInUser.email)?.status === 'Active' :
    members.find((m: any) => m.email === loggedInUser.email)?.status === 'Active';

  // Persist members to localStorage on change
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  // Persist logged in user email to localStorage on change
  useEffect(() => {
    localStorage.setItem('loggedInUserEmail', loggedInUserEmail);
  }, [loggedInUserEmail]);

  // Persist datasets to localStorage on change (excluding consumer_input)
  useEffect(() => {
    const datasetsToStore = datasets.filter(ds => ds.name !== 'consumer_input');
    localStorage.setItem('datasets', JSON.stringify(datasetsToStore));
  }, [datasets]);

  // Persist dataSinks to localStorage on change
  useEffect(() => {
    localStorage.setItem('dataSinks', JSON.stringify(dataSinks));
  }, [dataSinks]);

  const handleSignIn = (email: string) => {
    setLoggedInUserEmail(email);
    localStorage.setItem('loggedInUserEmail', email);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    
    // Reset Ram's status to "Invited" every time he logs in
    if (email === 'ram@fabrikam.com') {
      const updatedMembers = members.map((member: any) => 
        member.email === 'ram@fabrikam.com' 
          ? { ...member, status: 'Invited' }
          : member
      );
      setMembers(updatedMembers);
      localStorage.setItem('members', JSON.stringify(updatedMembers));
      
      // Add consumer_input dataset when Ram logs in
      const hasConsumerInput = datasets.some(ds => ds.name === 'consumer_input');
      if (!hasConsumerInput) {
        const updatedDatasets = [...datasets, consumerInputDataset];
        setDatasets(updatedDatasets);
      }
    }
    
    // Ensure Amit (owner) is always "Active" when he logs in
    if (email === 'amit@contoso.com') {
      const updatedMembers = members.map((member: any) => 
        member.email === 'amit@contoso.com' 
          ? { ...member, status: 'Active' }
          : member
      );
      setMembers(updatedMembers);
      localStorage.setItem('members', JSON.stringify(updatedMembers));
      
      // Remove consumer_input dataset when Amit logs in
      const updatedDatasets = datasets.filter(ds => ds.name !== 'consumer_input');
      setDatasets(updatedDatasets);
    }
    
    // Set active cleanroom to one where user has pending invitation, if any
    const pendingCleanroom = cleanrooms.find((cr: any) => {
      const userMembership = cr.members.find((m: any) => m.email === email);
      return userMembership && userMembership.status === 'Invited';
    });
    
    if (pendingCleanroom) {
      setActiveCleanroom(pendingCleanroom);
    }
  };

  const userInfoComponent = (
    <Stack horizontal tokens={{ childrenGap: 20 }} verticalAlign="center" styles={{
      root: {
        padding: '12px 20px',
        backgroundColor: '#ffffff',
        border: '1px solid #e1dfdd',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }
    }}>
      <Stack tokens={{ childrenGap: 2 }} horizontalAlign="start" styles={{ root: { minWidth: 140 } }}>
        <Text styles={{ 
          root: { 
            fontSize: '14px',
            fontWeight: 600, 
            color: '#323130',
            lineHeight: '20px',
            margin: 0
          } 
        }}>{loggedInUser.name}</Text>
        <Text styles={{ 
          root: { 
            fontSize: '12px',
            color: '#605e5c', 
            fontWeight: 400,
            lineHeight: '16px',
            margin: 0
          } 
        }}>{loggedInUser.email}</Text>
      </Stack>
      <div style={{
        width: '1px',
        height: '32px',
        backgroundColor: '#e1dfdd'
      }} />
      <Stack tokens={{ childrenGap: 2 }} horizontalAlign="start" styles={{ root: { minWidth: 100 } }}>
        <Text styles={{ 
          root: { 
            fontSize: '11px',
            fontWeight: 600,
            color: '#605e5c',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            lineHeight: '14px',
            margin: 0
          } 
        }}>MEMBERSHIP</Text>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: isActiveMember ? '#dff6dd' : '#fef7e7',
          border: `1px solid ${isActiveMember ? '#107c10' : '#d83b01'}`
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isActiveMember ? '#107c10' : '#d83b01',
            marginRight: '6px'
          }} />
          <Text styles={{ 
            root: { 
              fontSize: '11px',
              color: isActiveMember ? '#107c10' : '#d83b01', 
              fontWeight: 600,
              lineHeight: '14px',
              margin: 0
            } 
          }}>
            {isActiveMember ? 'ACTIVE' : 'INVITED'}
          </Text>
        </div>
      </Stack>
    </Stack>
  );

  return (
    <Router>
      {!isAuthenticated && <SimulatedLoginPanel onSignIn={handleSignIn} />}
      {isAuthenticated && (
        <AppLayout userInfo={userInfoComponent} activeCleanroom={activeCleanroom}>
          <AppRoutes 
            cleanrooms={cleanrooms}
            setActiveCleanroom={setActiveCleanroom}
            activeCleanroom={activeCleanroom}
            loggedInUser={loggedInUser}
            membersInitialTab={membersInitialTab}
            setCleanrooms={setCleanrooms}
            datasets={datasets}
            setDatasets={setDatasets}
            dataSinks={dataSinks}
            setDataSinks={setDataSinks}
            isActiveMember={isActiveMember}
          />
        </AppLayout>
      )}
    </Router>
  );
}