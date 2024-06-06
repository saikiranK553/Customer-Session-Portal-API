package com.maveric.customerSessionPortal.advice;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class Logging {

    private static final Logger logger = LoggerFactory.getLogger(Logging.class);

    @Before("execution(* com.maveric.CustomerSessionPortal.controller.*.*(..))")
    public void logBeforeControllerMethod(JoinPoint joinPoint) {
        log.info("Executing: " + joinPoint.getSignature().toShortString());
    }

    @AfterReturning(pointcut = "execution(* com.maveric.CustomerSessionPortal.controller.*.*(..))", returning = "result")
    public void logAfterControllerMethod(Object result) {
        log.info("Response: " + result.toString());
    }

    @AfterThrowing(pointcut = "execution(* com.maveric.CustomerSessionPortal.controller.*.*(..))", throwing = "ex")
    public void logExceptionInController(JoinPoint joinPoint, Exception ex) {
        log.error("Exception in: " + joinPoint.getSignature().toShortString() + ". Exception: " + ex.getMessage());
    }

    @Before("execution(* com.maveric.CustomerSessionPortal.service.*.*(..))")
    public void logBeforeServiceMethod(JoinPoint joinPoint) {
        log.info("Executing: " + joinPoint.getSignature().toShortString());
    }

    @AfterReturning(pointcut = "execution(* com.maveric.CustomerSessionPortal.service.*.*(..))", returning = "result")
    public void logAfterServiceMethod(Object result) {
        log.info("Response: " + result.toString());
    }

    @AfterThrowing(pointcut = "execution(* com.maveric.CustomerSessionPortal.service.*.*(..))", throwing = "ex")
    public void logExceptionInService(JoinPoint joinPoint, Exception ex) {
        log.error("Exception in: " + joinPoint.getSignature().toShortString() + ". Exception: " + ex.getMessage());
    }

    public void logMethodArguments(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            log.info("Request Argument: " + arg.toString());
        }
    }
}
