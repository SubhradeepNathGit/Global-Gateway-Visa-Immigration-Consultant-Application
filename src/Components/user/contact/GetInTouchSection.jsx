import React from 'react'
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material'

const GetInTouchSection = ({ contactItems }) => {
    return (
        <Box
            sx={{
                flex: '0 0 45%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mt: 1,
                    color: '#0f172a',
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.2rem' }
                }}
            >
                Get in touch with us
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    mt: 2,
                    color: '#64748b',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    lineHeight: 1.6
                }}
            >
                Lorem ipsum is simply free text available dolor sit amet, consectetur notted
                adipisicing elit sed do eiusmod tempor incididunt simply free ut labore et
                dolore magna aliqua.
            </Typography>

            {/* Contact Items */}
            <Box sx={{ mt: { xs: 3, md: 4 } }}>
                {contactItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: { xs: 2.5, md: 3 },
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: 'rgba(50, 132, 209, 1)',
                                    width: { xs: 60, md: 70 },
                                    height: { xs: 60, md: 70 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                    mr: { xs: 1.5, md: 2 },
                                    flexShrink: 0,
                                }}
                            >
                                {React.cloneElement(item.icon, {
                                    sx: { fontSize: { xs: 24, md: 28 }, color: '#fff' }
                                })}
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '0.9rem', md: '1rem' }
                                    }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#475569',
                                        fontSize: { xs: '0.85rem', md: '0.95rem' },
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {item.content}
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                ))}
            </Box>
        </Box>
    )
}

export default GetInTouchSection