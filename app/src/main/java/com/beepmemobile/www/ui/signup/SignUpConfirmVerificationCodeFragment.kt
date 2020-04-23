package com.beepmemobile.www.ui.signup

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.beepmemobile.www.R

class SignUpConfirmVerificationCodeFragment : Fragment() {

    companion object {
        fun newInstance() = SignUpConfirmVerificationCodeFragment()
    }

    private lateinit var viewModel: SignUpConfirmVerificationCodeViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(
            R.layout.sign_up_confirm_verification_code_fragment,
            container,
            false
        )
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel =
            ViewModelProviders.of(this).get(SignUpConfirmVerificationCodeViewModel::class.java)
        // TODO: Use the ViewModel
    }

}
